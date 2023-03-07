package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/interest"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const InterestsCollectionName = "interests"

type MongoInterestRepository struct {
	*MongoRepositoryBase[interest.Interest]
}

func NewMongoInterestRepository(c *di.Container) *interest.Repository {
	var repo interest.Repository = &MongoInterestRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[interest.Interest](InterestsCollectionName),
	}
	return &repo
}

func (r *MongoInterestRepository) DeleteBy(ctx context.Context, address primitive.ObjectID, targetId, targetType string) int {
	filter := bson.D{
		{"userId", address},
		{"targetId", targetId},
		{"targetType", targetType},
	}
	result, err := r.Collection(ctx).Col().DeleteMany(ctx, filter)
	errx.CheckError(err)
	return int(result.DeletedCount)
}
func (r *MongoInterestRepository) GetManyByUsers(ctx context.Context, users []primitive.ObjectID, targetType string) []interest.Interest {
	filter := bson.D{
		{"userId", bson.D{{"$in", users}}},
		{"targetType", targetType},
	}
	return r.Find(ctx, filter)
}

func (r *MongoInterestRepository) CheckMany(ctx context.Context, userIds []primitive.ObjectID, targetId []string, targetType string) []interest.Interest {
	filter := bson.D{
		{"userIds", bson.D{{"$in", userIds}}},
		{"targetId", bson.D{{"$in", targetId}}},
		{"targetType", targetType},
	}
	return r.Find(ctx, filter)
}
