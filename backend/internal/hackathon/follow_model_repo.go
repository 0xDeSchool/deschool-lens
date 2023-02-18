package hackathon

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
)

type Follow struct {
	FromAddr            string `bson:"fromAddr" json:"fromAddr"`
	ToAddr              string `bson:"toAddr" json:"toAddr"`
	ddd.AuditEntityBase `bson:",inline"`
}

type FollowRepository interface {
	ddd.RepositoryBase[Follow]
	CheckExistsByToAndFromAddr(ctx context.Context, fromAddr string, toAddr string) bool
	GetListByFilter(ctx context.Context, addr string, key string) []Follow
}
