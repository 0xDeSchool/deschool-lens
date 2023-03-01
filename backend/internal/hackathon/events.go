package hackathon

type EventItem struct {
	Id     string   `json:"id"`
	Labels []string `json:"labels"`
}

type EventInput struct {
	Address string      `json:"address"`
	Events  []EventItem `json:"events"`
}

type EventMatchedItem struct {
}

//func MatchEvents(ctx context.Context, input EventInput) []*EventMatchedItem {
//	interests := make([]string, 0) // 個人interests
//	repo := *di.Get[Q11eRepository]()
//	data := repo.GetByAddress(ctx, input.Address)
//	if data != nil {
//		interests = data.Interests
//	}
//
//	followRepo := *di.Get[FollowRepository]()
//	followingUsers := followRepo.GetFollowingUsers(ctx, input.Address)
//
//}
