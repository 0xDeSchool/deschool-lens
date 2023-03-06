package identity

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/ethereum/go-ethereum/common"
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

func (m *UserManager) Find(ctx context.Context, address string) *User {
	return m.Repo.Find(ctx, common.HexToAddress(address))
}

func (m *UserManager) Login(ctx context.Context, address common.Address, signHex string, t WalletType, platform *UserPlatform) *User {
	if !VerifySignMessage(address, signHex, SignTypeLogin, t) {
		ginx.PanicValidatition("verify sign failed")
	}
	ctx = ginx.WithScopedUnitWork(ctx)
	user := m.Repo.Find(ctx, address)
	if user == nil {
		user = &User{
			Address: address.Hex(),
		}
		id := m.Repo.Insert(ctx, user)
		if platform != nil {
			m.Link(ctx, platform)
		}
		user.ID = id
	}
	return user
}

func (m *UserManager) Link(ctx context.Context, link *UserPlatform) {
	// TODO: 由后端进行对应平台的验证
	//if !VerifySignMessage(common.HexToAddress(link.Address), signHex, SignTypeLink, t) {
	//	ginx.PanicUnAuthenticated("verify sign failed")
	//}
	link.VerifiedAt = time.Now()
	m.Repo.LinkPlatform(ctx, link)
}

func (m *UserManager) Unlink(ctx context.Context, platform, address string, handle string) {
	m.Repo.UnlinkPlatform(ctx, common.HexToAddress(address), platform, handle)
}

func (m *UserManager) Update(ctx context.Context, info *User) {
	m.Repo.Update(ctx, info.ID, info)
}
