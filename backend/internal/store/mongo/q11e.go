package mongo

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"go.mongodb.org/mongo-driver/bson"
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
		{Key: "address", Value: address},
	}
	return r.FindOne(ctx, filter)
}
