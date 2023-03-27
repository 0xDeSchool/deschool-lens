package hackathon

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type UserRecommendation struct {
	ddd.EntityBase `bson:",inline" json:"ddd.EntityBase"`
	UserId         primitive.ObjectID `bson:"userId"`
	TargetId       primitive.ObjectID `bson:"targetId"`
	Reasons        []string           `bson:"reasons"`
	CreatedAt      time.Time          `bson:"used"`
	Score          int                `bson:"score"`

	FromAddr string `bson:"fromAddr"`
	ToAddr   string `bson:"toAddr"`
}

type UserRecommendationRepository interface {
	ddd.Repository[UserRecommendation]

	GetUsers(ctx context.Context, userId primitive.ObjectID) []primitive.ObjectID
}
