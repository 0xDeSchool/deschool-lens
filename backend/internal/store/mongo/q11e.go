package mongo

import (
	"context"
	"github.com/ethereum/go-ethereum/common"

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

func (r *MongoQ11eRepository) GetByAddress(ctx context.Context, address string) *hackathon.Q11e {
	filter := bson.D{
		{Key: "address", Value: common.HexToAddress(address).Hex()},
	}
	return r.FindOne(ctx, filter)
}

func (r *MongoQ11eRepository) CheckAndGetExistsByAddr(ctx context.Context, address string) (bool, *hackathon.Q11e) {
	// 查询条件
	filter := bson.D{{
		Key:   "address",
		Value: address,
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

func (r *MongoQ11eRepository) GetManyByAddress(ctx context.Context, address []string) []hackathon.Q11e {
	filter := bson.D{
		{Key: "address", Value: bson.D{{Key: "$in", Value: address}}},
	}
	return r.Find(ctx, filter)
}
