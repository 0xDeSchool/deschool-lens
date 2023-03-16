package internal

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	identity2 "github.com/0xdeschool/deschool-lens/backend/internal/modules/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/ethereum/go-ethereum/common"
)

func Scripts(b *app.AppBuilder) {
	b.CmdBuilder.AddRun("fix", "fix", runFix)
}

var cachedUser = map[string]*identity2.User{}

var userRepo identity2.UserRepository

func runFix() {
	ctx := context.Background()
	userRepo = *di.Get[identity2.UserRepository]()

	fixResume(ctx)

}

func fixUsers(ctx context.Context) {
	r := *di.Get[hackathon.IdRepository]()
	users := make([]identity2.User, 0)
	data := r.GetAll(ctx)
	for i := range data {
		u := &data[i]
		item := identity2.User{
			Address: u.Address,
		}
		item.ID = u.ID
		item.CreatorId = u.CreatorId
		item.CreatedAt = u.CreatedAt
		item.DisplayName = u.Address
		users = append(users, item)
	}
	userRepo := *di.Get[identity2.UserRepository]()
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

func fixUserLink(ctx context.Context) {
	ir := *di.Get[hackathon.IdRepository]()
	ur := *di.Get[identity2.UserManager]()
	ids := ir.GetAll(ctx)
	for i := range ids {
		id := &ids[i]
		user := ur.Find(ctx, id.Address)
		if id.Platform == hackathon.LensPlatform {
			ur.Link(ctx, &identity2.UserPlatform{
				UserId:     user.ID,
				Platform:   identity2.PlatformLens,
				Handle:     id.LensHandle,
				Address:    id.Address,
				VerifiedAt: id.CreatedAt,
			})
		}
	}
}

func getUser(ctx context.Context, addr string) *identity2.User {
	if user, ok := cachedUser[addr]; ok {
		return user
	}
	user := userRepo.Find(ctx, common.HexToAddress(addr))
	cachedUser[addr] = user
	return user
}

func fixResume(ctx context.Context) {
	repo := *di.Get[hackathon.ResumeRepository]()
	data := repo.GetAll(ctx)
	for i := range data {
		r := &data[i]
		if r.UserId.IsZero() {
			u := getUser(ctx, r.Address)
			if u == nil {
				log.Warn("resume: user not found:" + r.Address)
				continue
			}
			r.UserId = u.ID
			repo.Update(ctx, r.ID, r)
		}
	}
}
