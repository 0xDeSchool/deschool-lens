package hackathon

import (
	"context"
	"fmt"
	"github.com/0xdeschool/deschool-lens/backend/internal/interest"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/0xdeschool/deschool-lens/backend/pkg/x"
	"strings"
	"time"
)

const TargetTypeLink3Event = "link3_event" // link3 event

type EventItem struct {
	Id     string   `json:"id"`
	Labels []string `json:"labels"`
}

type EventInput struct {
	Address string       `json:"address"`
	Events  []*EventItem `json:"events"`
	Users   []string     `json:"users"`
}

type EventMatchedItem struct {
	Id          string          `json:"id"`
	IsEnabled   bool            `json:"isEnabled"`
	Interested  []string        `json:"interested"`
	Matched     []string        `json:"matchedUsers"`
	Following   []string        `json:"followingUsers"`
	Courses     []*CourseDetail `json:"courses"`
	Registrants []string        `json:"registrants"`
}

type RecommendEventParams struct {
	InterestedLabels    []string `json:"interestedLabels"`
	MatchedInterested   []string `json:"matchedInterested"`
	FollowingInterested []string `json:"followingInterested"`
}

func GetRecommendEventParams(ctx context.Context, addr string) *RecommendEventParams {
	result := &RecommendEventParams{
		InterestedLabels:    make([]string, 0),
		MatchedInterested:   make([]string, 0),
		FollowingInterested: make([]string, 0),
	}
	repo := *di.Get[Q11eRepository]()
	data := repo.GetByAddress(ctx, addr)
	if data != nil {
		result.InterestedLabels = data.Interests
	}
	repo2 := *di.Get[interest.Repository]()

	followRepo := *di.Get[FollowRepository]()
	followingUsers := followRepo.GetFollowingUsers(ctx, addr)
	users := repo2.GetManyByAddr(ctx, followingUsers, TargetTypeLink3Event)
	for _, user := range users {
		result.FollowingInterested = append(result.FollowingInterested, user.TargetId)
	}
	return result
}

func NewItem() *EventMatchedItem {
	return &EventMatchedItem{
		Interested: make([]string, 0),
		Matched:    make([]string, 0),
		Following:  make([]string, 0),
	}
}

func (e *EventMatchedItem) IsMatched() bool {
	return len(e.Interested) > 0 || len(e.Matched) > 0 || len(e.Following) > 0
}

type CourseDetail struct {
	Id          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	SeriesId    string    `json:"seriesId"`
	CoverImage  string    `json:"coverImage"`
	CreatorId   string    `json:"creatorId"`
	CreatedAt   time.Time `json:"createdAt"`
}

func MatchEvents(ctx context.Context, input EventInput) []*EventMatchedItem {
	interests := make([]string, 0) // 個人interests
	repo := *di.Get[Q11eRepository]()
	data := repo.GetByAddress(ctx, input.Address)
	if data != nil {
		interests = data.Interests
	}
	interestsSet := linq.ToSet(interests)
	ids := linq.Map(input.Events, func(e **EventItem) string { return (*e).Id })
	insRepo := *di.Get[interest.Repository]()

	followRepo := *di.Get[FollowRepository]()
	followingUsers := followRepo.GetFollowingUsers(ctx, input.Address)
	followingData := insRepo.CheckMany(ctx, followingUsers, ids, TargetTypeLink3Event)
	following := linq.GroupBy(followingData, func(i *interest.Interest) string { return i.TargetId })

	matchRepo := *di.Get[UserRecommendationRepository]()
	matchedUsers := matchRepo.GetUsers(ctx, input.Address)
	matchedData := insRepo.CheckMany(ctx, matchedUsers, ids, TargetTypeLink3Event)
	matched := linq.GroupBy(matchedData, func(i *interest.Interest) string { return i.TargetId })

	result := make([]*EventMatchedItem, 0, len(input.Events))
	for _, e := range input.Events {
		item := NewItem()
		item.Id = e.Id
		for _, l := range e.Labels {
			key := strings.ToLower(l)
			if _, ok := interestsSet[key]; ok {
				item.Interested = append(item.Interested, l)
			}
		}

		if addrs, ok := following[e.Id]; ok {
			item.Following = linq.Map(addrs, func(i **interest.Interest) string { return (*i).Address })
		}

		if addrs, ok := matched[e.Id]; ok {
			item.Matched = linq.Map(addrs, func(i **interest.Interest) string { return (*i).Address })
		}

		item.Courses = RecommendCourses(ctx, e.Labels)
		//item.Registrants = filterUsers(ctx, e.Id, input.Users)
		item.IsEnabled = item.IsMatched()
		result = append(result, item)
	}
	return result
}

type userInterest struct {
	Address   string              `json:"address"`
	Interests map[string]struct{} `json:"interests"`
}

func toDict(data []Q11e) []userInterest {
	result := make([]userInterest, 0, len(data))
	for _, d := range data {
		item := userInterest{
			Address:   d.Address,
			Interests: linq.ToSet(d.Interests),
		}
		result = append(result, item)
	}
	return result
}

type courseBody struct {
	x.PageAndSort `json:",inline"`
	Labels        []string `json:"labels"`
}

//func filterUsers(ctx context.Context, eventId string, users []string) []string {
//	insRepo := *di.Get[interest.Repository]()
//	interestIds := insRepo.CheckMany(ctx, users, eventId, TargetTypeLink3Event)
//
//	idRepo := *di.Get[IdRepository]()
//	ids := idRepo.CheckAddrs(ctx, users)
//	return linq.Combine(interestIds, ids)
//}

func RecommendCourses(ctx context.Context, labels []string) []*CourseDetail {
	c := di.Get[ginx.RequestClient]()
	opts := di.Get[HackathonOptions]()
	result := ddd.PagedItems[*CourseDetail]{
		Items: make([]*CourseDetail, 0),
	}
	url := fmt.Sprintf("%s/api/courses/recommends", opts.DeschoolUrl)
	err := c.PostObj(url, &courseBody{
		PageAndSort: *x.PageLimit(3),
		Labels:      labels,
	}, &result)
	if err != nil {
		log.Warn("request recommend course error", err)
	}
	return result.Items
}
