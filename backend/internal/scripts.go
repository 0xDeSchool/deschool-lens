package internal

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/ethereum/go-ethereum/common"
)

func Scripts(b *app.AppBuilder) {
	b.CmdBuilder.AddRun("fix", "fix", runFix)
}

var cachedUser = map[string]*identity.User{}

var userRepo identity.UserRepository

func runFix() {
	ctx := context.Background()
	userRepo = *di.Get[identity.UserRepository]()
	//fixUsers(ctx)
	//fixFollow(ctx)
	//fixMatch(ctx)
	fixQ11E(ctx)
}

func fixUsers(ctx context.Context) {
	r := *di.Get[hackathon.IdRepository]()
	users := make([]identity.User, 0)
	data := r.GetAll(ctx)
	for i := range data {
		u := &data[i]
		item := identity.User{
			Address: u.Address,
		}
		item.ID = u.ID
		item.DisplayName = u.Address
		users = append(users, item)
	}
	userRepo := *di.Get[identity.UserRepository]()
	userRepo.InsertMany(ctx, users, true)
}

func fixFollow(ctx context.Context) {
	fr := *di.Get[hackathon.FollowRepository]()
	data := fr.GetAll(ctx)
	for i := range data {
		f := &data[i]
		if f.FromUser.IsZero() {
			f.FromUser = getUser(ctx, f.FromAddr).ID
			f.ToUser = getUser(ctx, f.ToAddr).ID
			fr.Update(ctx, f.ID, f)
		}
	}
}

func fixMatch(ctx context.Context) {
	fr := *di.Get[hackathon.UserRecommendationRepository]()
	data := fr.GetAll(ctx)
	for i := range data {
		f := &data[i]
		if f.UserId.IsZero() {
			f.UserId = getUser(ctx, f.FromAddr).ID
			f.TargetId = getUser(ctx, f.ToAddr).ID
			fr.Update(ctx, f.ID, f)
		}
	}
}

func fixQ11E(ctx context.Context) {
	fr := *di.Get[hackathon.Q11eRepository]()
	data := fr.GetAll(ctx)
	for i := range data {
		f := &data[i]
		if f.UserId.IsZero() {
			u := getUser(ctx, f.Address)
			if u == nil {
				log.Warn("q11e: user not found:" + f.Address)
			} else {
				f.UserId = u.ID
				fr.Update(ctx, f.ID, f)
			}

		}
	}
}

func getUser(ctx context.Context, addr string) *identity.User {
	if user, ok := cachedUser[addr]; ok {
		return user
	}
	user := userRepo.Find(ctx, common.HexToAddress(addr))
	cachedUser[addr] = user
	return user
}
