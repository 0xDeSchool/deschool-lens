package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"time"
)

type UserPlatformType string

const (
	PlatformLens         UserPlatformType = "lens"
	PlatformCyberConnect UserPlatformType = "cc"
	PlatformDeSchool     UserPlatformType = "deschool"
)

type User struct {
	ddd.FullAuditEntityBase `bson:",inline"`
	ddd.WithExtraEntity     `bson:",inline"`
	Address                 string          `bson:"address"`
	UserName                string          `bson:"userName"`
	NickName                string          `bson:"nickName"`
	Avatar                  string          `bson:"avatar"`
	Bio                     string          `bson:"bio"`
	Platforms               []*UserPlatform `bson:"-"`
}

type UserPlatform struct {
	ddd.AuditEntityBase `bson:",inline"`
	ddd.WithExtraEntity `bson:",inline"`
	UserId              string           `bson:"userId"`   // 对应用户的唯一标识
	Address             string           `bson:"address"`  // 使用平台的地址
	Handle              string           `bson:"handle"`   // 对应平台的用户标识
	Platform            UserPlatformType `bson:"platform"` // 平台唯一标识，如 lens, cc(CyberConnect), deschool
	VerifiedAt          time.Time        `bson:"verifiedAt"`
}

type SignNonce struct {
	ddd.AuditEntityBase `bson:",inline"`
	Address             string `bson:"address"`
	Nonce               string `bson:"Nonce"`
}
