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

func (m *UserManager) Login(ctx context.Context, address common.Address, signHex string, t WalletType) *User {
	if !VerifySignMessage(address, signHex, SignTypeLogin, t) {
		ginx.PanicUnAuthenticated("verify sign failed")
	}
	hexAddr := address.Hex()
	user := m.Repo.Find(ctx, hexAddr)
	if user == nil {
		user = &User{
			Address: hexAddr,
		}
		m.Repo.Insert(ctx, user)
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
