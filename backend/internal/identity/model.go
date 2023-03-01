package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"time"
)

type User struct {
	ddd.FullAuditEntityBase `bson:",inline"`
	ddd.WithExtraEntity     `bson:",inline"`
	Address                 string          `bson:"address"`
	UserName                string          `bson:"userName"`
	Avatar                  string          `bson:"avatar"`
	Bio                     string          `bson:"bio"`
	Platforms               []*UserPlatform `bson:"-"`
}

type UserPlatform struct {
	ddd.AuditEntityBase `bson:",inline"`
	ddd.WithExtraEntity `bson:",inline"`
	Address             string    `bson:"address"`
	Handle              string    `bson:"handle"`   // 对应平台的用户标识
	Platform            string    `bson:"platform"` // 平台唯一标识，如 lens, cc(CyberConnect), deschool
	VerifiedAt          time.Time `bson:"verifiedAt"`
}

type SignNonce struct {
	ddd.AuditEntityBase `bson:",inline"`
	Address             string `bson:"address"`
	Nonce               string `bson:"Nonce"`
}
