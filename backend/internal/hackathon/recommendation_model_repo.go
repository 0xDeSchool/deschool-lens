package hackathon

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type UserRecommendation struct {
	UserId    primitive.ObjectID `bson:"userId"`
	TargetId  primitive.ObjectID `bson:"targetId"`
	Reasons   []string           `bson:"reasons"`
	CreatedAt time.Time          `bson:"used"`
	Score     int                `bson:"score"`
}

type UserRecommendationRepository interface {
	ddd.RepositoryBase[UserRecommendation]

	GetUsers(ctx context.Context, userId primitive.ObjectID) []primitive.ObjectID
}
