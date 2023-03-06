package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
)

type LinkPlatformInput struct {
	Handle     string            `json:"handle"`                      // 对应平台的用户标识
	Platform   UserPlatformType  `json:"platform" binding:"required"` // 平台唯一标识，如 lens, cc(CyberConnect), deschool
	Address    string            `json:"address"  binding:"required"` // 平台地址
	WalletType WalletType        `json:"walletType"`                  // 当前签名的钱包类型
	SignHex    string            `json:"signHex"`
	Data       map[string]string `json:"data"` // 附加数据
}

func (l *LinkPlatformInput) ToEntity() *UserPlatform {
	if l == nil {
		return nil
	}
	p := &UserPlatform{
		Handle:   l.Handle,
		Platform: l.Platform,
		Address:  l.Address,
	}
	p.Data = l.Data
	return p
}

type UnlinkPlatformInput struct {
	Handle   string `json:"handle"`                      // 对应平台的用户标识
	Address  string `json:"address"  binding:"required"` // 平台地址
	Platform string `json:"platform" binding:"required"` // 平台唯一标识，如 lens, cc(CyberConnect), deschool
}

type UserInfo struct {
	Id          string      `json:"id"`
	Address     string      `json:"address"`
	DisplayName string      `json:"displayName"`
	Avatar      string      `json:"avatar"`
	Bio         string      `json:"bio"`
	Platforms   []*Platform `json:"platforms"`
}

type Platform struct {
	Platform UserPlatformType  `json:"platform"`
	Handle   string            `json:"handle"`
	Data     map[string]string `json:"data,omitempty"`
}

func NewPlatform(p *UserPlatform, isSelf bool) *Platform {
	data := &Platform{
		Platform: p.Platform,
		Handle:   p.Handle,
	}
	if isSelf {
		data.Data = p.Data
	}
	return data
}

func NewUserInfo(user *User, isSelf bool) *UserInfo {
	return &UserInfo{
		Id:          user.ID.Hex(),
		Address:     user.Address,
		DisplayName: user.DisplayName,
		Avatar:      user.Avatar,
		Bio:         user.Bio,
		Platforms: linq.Map(user.Platforms, func(p **UserPlatform) *Platform {
			return NewPlatform(*p, isSelf)
		}),
	}
}

type UserUpdateInput struct {
	DisplayName *string `json:"displayName"`
	Avatar      *string `json:"avatar"`
	Bio         *string `json:"bio"`
}

func (input *UserUpdateInput) ToEntity(u *User) {
	if input.DisplayName != nil {
		u.DisplayName = *input.DisplayName
	}
	if input.Avatar != nil {
		u.Avatar = *input.Avatar
	}
	if input.Bio != nil {
		u.Bio = *input.Bio
	}
}
