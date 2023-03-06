package hackathon

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/internal/interest"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/0xdeschool/deschool-lens/backend/pkg/x"
	"github.com/ethereum/go-ethereum/common"
	"net/http"
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

type UserItem struct {
	Id          string `json:"id"`
	DisplayName string `json:"displayName"`
	Avatar      string `json:"avatar"`
	Address     string `json:"address"`
}

type UserEventItem struct {
	Users []UserItem `json:"users"`
	Count int        `json:"count"`
}

type EventMatchedItem struct {
	Id          string          `json:"id"`
	IsEnabled   bool            `json:"isEnabled"`
	Interested  []string        `json:"interested"`
	Matched     *UserEventItem  `json:"matchedUsers"`
	Following   *UserEventItem  `json:"followingUsers"`
	Courses     []*CourseDetail `json:"courses"`
	Registrants []string        `json:"registrants"`
}

func NewItem() *EventMatchedItem {
	return &EventMatchedItem{
		Interested: make([]string, 0),
	}
}

func (e *EventMatchedItem) IsMatched() bool {
	return len(e.Interested) > 0 || e.Matched != nil || e.Following != nil
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
	following := getUserEventItems(ctx, followingData, 3)

	matchRepo := *di.Get[UserRecommendationRepository]()
	matchedUsers := matchRepo.GetUsers(ctx, input.Address)
	matchedData := insRepo.CheckMany(ctx, matchedUsers, ids, TargetTypeLink3Event)
	matched := getUserEventItems(ctx, matchedData, 3)

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

		if _, ok := following[e.Id]; ok {
			item.Following = following[e.Id]
		}

		if _, ok := matched[e.Id]; ok {
			item.Matched = matched[e.Id]
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
	opts := di.Get[HackathonOptions]()

	url := fmt.Sprintf("%s/api/courses/recommends", opts.DeschoolUrl)
	body, _ := json.Marshal(&courseBody{
		PageAndSort: *x.PageLimit(3),
		Labels:      labels,
	})
	result := ddd.PagedItems[*CourseDetail]{
		Items: make([]*CourseDetail, 0),
	}
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		log.Warn("request recommend course error", err)
		return result.Items
	}

	defer resp.Body.Close()
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Warn("decode recommend course error", err)
	}
	return result.Items
}

func getUserEventItems(ctx context.Context, data []interest.Interest, limit int) map[string]*UserEventItem {
	result := make(map[string]*UserEventItem)
	ids := linq.Map(data, func(i *interest.Interest) string { return i.Address })
	users := includeUsers(ctx, ids)
	for i := range data {
		v := &data[i]
		items, ok := result[v.TargetId]
		if !ok {
			items = &UserEventItem{
				Users: make([]UserItem, 0),
			}
			result[v.TargetId] = items
		}
		if user, ok := users[v.Address]; ok {
			if len(items.Users) < limit {
				items.Users = append(items.Users, UserItem{
					Id:          user.ID.Hex(),
					Address:     user.Address,
					DisplayName: user.DisplayName,
					Avatar:      user.Avatar,
				})
			}
			items.Count++
		}
	}
	return result
}

func includeUsers(ctx context.Context, addrs ...[]string) map[string]*identity.User {
	input := make([]common.Address, 0)
	for _, addr := range addrs {
		for _, a := range addr {
			input = append(input, common.HexToAddress(a))
		}
	}
	result := make(map[string]*identity.User)
	if len(input) == 0 {
		return result
	}
	repo := *di.Get[identity.UserRepository]()
	users := repo.GetManyByAddr(ctx, input)
	for i := range users {
		result[users[i].Address] = &users[i]
	}
	return result
}
