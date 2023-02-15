package mongo

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"go.mongodb.org/mongo-driver/bson"
)

const ResumeCollectionName = "resume"

type MongoResumeRepository struct {
	*MongoRepositoryBase[hackathon.Resume]
}

func NewMongoResumeRepository(c *di.Container) *hackathon.ResumeRepository {
	var repo hackathon.ResumeRepository = &MongoResumeRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[hackathon.Resume](ResumeCollectionName),
	}
	return &repo
}

func (r *MongoResumeRepository) FindOneByAddress(ctx context.Context, address string) *hackathon.Resume {
	filter := bson.D{
		{Key: "address", Value: address},
	}
	return r.FindOne(ctx, filter)
}
