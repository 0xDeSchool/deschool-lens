package interest

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Interest struct {
	UserId     primitive.ObjectID `bson:"userId" json:"userId"`
	TargetId   string             `bson:"targetId" json:"targetId"`
	TargetType string             `bson:"targetType" json:"targetType"`
	CreatedAt  time.Time          `bson:"createdAt"`
}

type Repository interface {
	ddd.RepositoryBase[Interest]

	SetInterest(ctx context.Context, ins *Interest) int
	GetManyByUsers(ctx context.Context, userIds []primitive.ObjectID, targetType string) []Interest
	GetUsers(ctx context.Context, targetId []string, targetType string) []Interest

	DeleteBy(ctx context.Context, userId primitive.ObjectID, targetId, targetType string) int
	CheckMany(ctx context.Context, userId []primitive.ObjectID, targetId []string, targetType string) []Interest
}
