package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type UserPlatformType int

const (
	PlatformDeSchool     UserPlatformType = 1
	PlatformLens         UserPlatformType = 2
	PlatformCyberConnect UserPlatformType = 3
)

type Contact struct {
	Id          string            `bson:"id"`
	Type        string            `bson:"type"`
	Name        string            `bson:"name,omitempty"`
	Description string            `bson:"description,omitempty"`
	Icon        string            `bson:"icon,omitempty"`
	Url         string            `bson:"url,omitempty"`
	Privates    map[string]string `bson:"privates,omitempty"`
}

type User struct {
	ddd.FullAuditEntityBase `bson:",inline"`
	ddd.WithExtraEntity     `bson:",inline"`
	Address                 string          `bson:"address"`
	UserName                string          `bson:"userName"`
	DisplayName             string          `bson:"displayName"`
	Avatar                  string          `bson:"avatar"`
	Bio                     string          `bson:"bio"`
	Contacts                []*Contact      `bson:"contacts"`
	Platforms               []*UserPlatform `bson:"-"`
}

func (u *User) Contract(name string) string {
	for _, v := range u.Contacts {
		if v.Type == name {
			return v.Url
		}
	}
	return ""
}

func (u *User) SetContract(c *Contact) {
	for i, v := range u.Contacts {
		if v.Type == c.Type {
			u.Contacts[i] = c
			return
		}
	}
	u.Contacts = append(u.Contacts, c)
}

type UserPlatform struct {
	ddd.AuditEntityBase `bson:",inline"`
	ddd.WithExtraEntity `bson:",inline"`
	UserId              primitive.ObjectID `bson:"userId"`   // 对应用户的唯一标识
	Platform            UserPlatformType   `bson:"platform"` // 平台唯一标识，如 lens, cc(CyberConnect), deschool
	Handle              string             `bson:"handle"`   // 对应平台的用户标识
	Address             string             `bson:"address"`  // 使用平台的地址
	DisplayName         string             `bson:"displayName"`
	Avatar              string             `bson:"avatar"`
	VerifiedAt          time.Time          `bson:"verifiedAt"`
}

type SignNonce struct {
	ddd.AuditEntityBase `bson:",inline"`
	Address             string `bson:"address"`
	Nonce               string `bson:"Nonce"`
}
