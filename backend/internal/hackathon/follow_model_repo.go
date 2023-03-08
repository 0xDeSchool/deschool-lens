package hackathon

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Follow struct {
	FromAddr            string `bson:"fromAddr" json:"fromAddr"`
	ToAddr              string `bson:"toAddr" json:"toAddr"`
	ddd.AuditEntityBase `bson:",inline"`
	FromUser            primitive.ObjectID `bson:"fromUser"`
	ToUser              primitive.ObjectID `bson:"toUser"`
}

type FollowRepository interface {
	ddd.RepositoryBase[Follow]
	CheckExistsByToAndFromAddr(ctx context.Context, fromUser primitive.ObjectID, toUser primitive.ObjectID) bool
	GetListByFilter(ctx context.Context, userId primitive.ObjectID, key string) []Follow
	DeleteByToAndFrom(ctx context.Context, fromUser primitive.ObjectID, toUser primitive.ObjectID) bool

	GetFollowingUsers(ctx context.Context, userId primitive.ObjectID) []primitive.ObjectID

	GetFollowingCount(ctx context.Context, userIds []primitive.ObjectID) map[primitive.ObjectID]int
	GetFollowerCount(ctx context.Context, userIds []primitive.ObjectID) map[primitive.ObjectID]int
	CheckIsFollowing(ctx context.Context, userId primitive.ObjectID, ids []primitive.ObjectID) map[primitive.ObjectID]bool
}

type FollowerList struct {
	VistorFollowedPerson bool
	PersonFollowedVistor bool
	Follower             *UserItem
}

type FollowingList struct {
	VistorFollowedPerson bool
	PersonFollowedVistor bool
	Following            *UserItem
}
