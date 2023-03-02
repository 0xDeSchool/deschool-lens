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
	DeleteByToAndFrom(ctx context.Context, fromAddr string, toAddr string) bool

	GetFollowingUsers(ctx context.Context, addr string) []string
}

type FollowerList struct {
	VistorFollowedPerson bool
	PersonFollowedVistor bool
	Follower             string
}

type FollowingList struct {
	VistorFollowedPerson bool
	PersonFollowedVistor bool
	Following            string
}
