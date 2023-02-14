package mongo

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"go.mongodb.org/mongo-driver/bson"
)

const IdCollectionName = "id"

type MongoIdRepository struct {
	*MongoRepositoryBase[hackathon.Id]
}

func NewMongoIdRepository(c *di.Container) *hackathon.IdRepository {
	var repo hackathon.IdRepository = &MongoIdRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[hackathon.Id](IdCollectionName),
	}
	return &repo
}

func (r *MongoIdRepository) GetListByAddress(ctx context.Context, address string) []hackathon.Id {
	filter := bson.D{
		{Key: "address", Value: address},
	}
	return r.Find(ctx, filter)
}
