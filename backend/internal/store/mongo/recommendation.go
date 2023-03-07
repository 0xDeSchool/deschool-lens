package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MongoUserRecommendRepository struct {
	*MongoRepositoryBase[hackathon.UserRecommendation]
}

func NewMongoUserRecommendRepository(c *di.Container) *hackathon.UserRecommendationRepository {
	var repo hackathon.UserRecommendationRepository = &MongoUserRecommendRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[hackathon.UserRecommendation]("matched_records"),
	}
	return &repo
}

func (r *MongoUserRecommendRepository) GetUsers(ctx context.Context, userId primitive.ObjectID) []primitive.ObjectID {
	filter := bson.D{
		{Key: "userId", Value: userId},
	}
	data := r.Find(ctx, filter)
	return linq.Map(data, func(x *hackathon.UserRecommendation) primitive.ObjectID {
		return x.TargetId
	})
}
