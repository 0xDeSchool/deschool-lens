package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/ethereum/go-ethereum/common"
)

type LinkPlatformInput struct {
	Handle      string            `json:"handle"`                      // 对应平台的用户标识
	Platform    UserPlatformType  `json:"platform" binding:"required"` // 平台唯一标识，如 lens, cc(CyberConnect), deschool
	DisplayName string            `json:"displayName"`                 // 平台上的用户名
	Address     string            `json:"address"  binding:"required"` // 平台地址
	WalletType  WalletType        `json:"walletType"`                  // 当前签名的钱包类型
	SignHex     string            `json:"signHex"`
	Avatar      string            `json:"avatar"`
	Data        map[string]string `json:"data"` // 附加数据
}

func (l *LinkPlatformInput) ToEntity() *UserPlatform {
	if l == nil {
		return nil
	}
	p := &UserPlatform{
		Handle:      l.Handle,
		Platform:    l.Platform,
		Address:     common.HexToAddress(l.Address).Hex(),
		DisplayName: l.DisplayName,
		Avatar:      l.Avatar,
	}
	p.Data = l.Data
	return p
}

type UnlinkPlatformInput struct {
	Handle   string           `json:"handle"`                      // 对应平台的用户标识
	Address  string           `json:"address"  binding:"required"` // 平台地址
	Platform UserPlatformType `json:"platform" binding:"required"` // 平台唯一标识，如 lens, cc(CyberConnect), deschool
}

type ContactDto struct {
	Type        string `json:"contactType" binding:"required"`
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Icon        string `json:"icon,omitempty"`
	Url         string `json:"url,omitempty"`
}

func (cc *ContactDto) ToEntity() *Contact {
	return &Contact{
		Name:        cc.Name,
		Type:        cc.Type,
		Description: cc.Description,
		Icon:        cc.Icon,
		Url:         cc.Url,
	}
}

func NewContractDto(c *Contact) *ContactDto {
	if c == nil {
		return nil
	}
	return &ContactDto{
		Type: c.Type,
		Name: c.Name,
		Icon: c.Icon,
		Url:  c.Url,
	}
}

type UserInfo struct {
	Id          string        `json:"id"`
	Address     string        `json:"address"`
	DisplayName string        `json:"displayName"`
	Avatar      string        `json:"avatar"`
	Bio         string        `json:"bio"`
	Platforms   []*Platform   `json:"platforms"`
	Contacts    []*ContactDto `json:"contacts,omitempty"`
}

type Platform struct {
	Platform UserPlatformType  `json:"platform"`
	Address  string            `json:"address"`
	Handle   string            `json:"handle"`
	Data     map[string]string `json:"data,omitempty"`
}

func NewPlatform(p *UserPlatform, isSelf bool) *Platform {
	data := &Platform{
		Platform: p.Platform,
		Handle:   p.Handle,
		Address:  p.Address,
	}
	if isSelf {
		data.Data = p.Data
	}
	return data
}

func NewUserInfo(user *User, isSelf bool) *UserInfo {
	if user == nil {
		return nil
	}
	return &UserInfo{
		Id:          user.ID.Hex(),
		Address:     user.Address,
		DisplayName: user.DisplayName,
		Avatar:      user.Avatar,
		Bio:         user.Bio,
		Contacts:    linq.Map(user.Contacts, func(c **Contact) *ContactDto { return NewContractDto(*c) }),
		Platforms: linq.Map(user.Platforms, func(p **UserPlatform) *Platform {
			return NewPlatform(*p, isSelf)
		}),
	}
}

type UserUpdateInput struct {
	DisplayName *string       `json:"displayName"`
	Avatar      *string       `json:"avatar"`
	Bio         *string       `json:"bio"`
	Contacts    []*ContactDto `json:"contacts"`
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

	if input.Contacts != nil {
		for i := range input.Contacts {
			c := input.Contacts[i]
			if c != nil {
				u.SetContract(c.ToEntity())
			}
		}
	}
}
