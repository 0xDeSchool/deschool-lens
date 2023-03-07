package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

const Q11eCollectionName = "q11e"

type MongoQ11eRepository struct {
	*MongoRepositoryBase[hackathon.Q11e]
}

func NewMongoQ11eRepository(c *di.Container) *hackathon.Q11eRepository {
	var repo hackathon.Q11eRepository = &MongoQ11eRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[hackathon.Q11e](Q11eCollectionName),
	}
	return &repo
}

func (r *MongoQ11eRepository) GetByAddress(ctx context.Context, userId primitive.ObjectID) *hackathon.Q11e {
	filter := bson.D{
		{Key: "userId", Value: userId},
	}
	return r.FindOne(ctx, filter)
}

func (r *MongoQ11eRepository) CheckAndGetExistsByAddr(ctx context.Context, userId primitive.ObjectID) (bool, *hackathon.Q11e) {
	// 查询条件
	filter := bson.D{{
		Key:   "userId",
		Value: userId,
	}}
	var result hackathon.Q11e
	err := r.Collection(ctx).Col().FindOne(ctx, filter).Decode(&result)

	// 不存在 Q11e
	if err == mongo.ErrNoDocuments {
		return false, nil
	} else {
		errx.CheckError(err)
	}

	return true, &result
}

func (r *MongoQ11eRepository) GetManyByAddress(ctx context.Context, userIds []primitive.ObjectID) []hackathon.Q11e {
	filter := bson.D{
		{Key: "userId", Value: bson.D{{Key: "$in", Value: userIds}}},
	}
	return r.Find(ctx, filter)
}
