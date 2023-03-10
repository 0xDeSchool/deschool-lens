package identity

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/ethereum/go-ethereum/common"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

func NewUserManager(d *di.Container) *UserManager {
	return &UserManager{
		Repo: *di.Get[UserRepository](),
	}
}

type UserManager struct {
	Repo UserRepository
}

func (m *UserManager) Find(ctx context.Context, addr string) *User {
	var u *User
	if common.IsHexAddress(addr) {
		u = m.Repo.Find(ctx, common.HexToAddress(addr))
	} else if id, err := primitive.ObjectIDFromHex(addr); err == nil {
		u = m.Repo.FirstOrDefault(ctx, id)
	}
	if u == nil {
		return nil
	}
	platforms := m.Repo.GetPlatforms(ctx, u.ID)
	u.Platforms = linq.Map(platforms, func(p *UserPlatform) *UserPlatform { return p })
	return u
}

func (m *UserManager) Login(ctx context.Context, address common.Address, signHex string, t WalletType, platform *UserPlatform) *User {
	if !VerifySignMessage(address, signHex, SignTypeLogin, t) {
		ginx.PanicValidatition("verify sign failed")
	}
	user := m.Repo.Find(ctx, address)
	if user == nil {
		user = &User{
			Address:     address.Hex(),
			DisplayName: address.Hex(),
		}
		id := m.Repo.Insert(ctx, user)
		if platform != nil {
			m.Link(ctx, platform)
		}
		user.ID = id
	}
	return user
}

func (m *UserManager) ManyIncludePlatforms(ctx context.Context, users []User) {
	userIds := linq.Map(users, func(u *User) primitive.ObjectID { return u.ID })
	platforms := m.Repo.GetManyPlatforms(ctx, userIds)
	dict := linq.GroupBy(platforms, func(p *UserPlatform) primitive.ObjectID { return p.UserId })
	for i := range users {
		users[i].Platforms = dict[users[i].ID]
	}
}

func (m *UserManager) Link(ctx context.Context, link *UserPlatform) {
	// TODO: 由后端进行对应平台的验证
	//if !VerifySignMessage(common.HexToAddress(link.Address), signHex, SignTypeLink, t) {
	//	ginx.PanicUnAuthenticated("verify sign failed")
	//}
	link.VerifiedAt = time.Now()
	m.Repo.LinkPlatform(ctx, link)
}

func (m *UserManager) Unlink(ctx context.Context, userId primitive.ObjectID, platform UserPlatformType, address string, handle string) {
	count := m.Repo.UnlinkPlatform(ctx, userId, common.HexToAddress(address), handle, platform)
	log.Infof("unlink platform", "count", count)
}

func (m *UserManager) Update(ctx context.Context, info *User) {
	m.Repo.Update(ctx, info.ID, info)
}
