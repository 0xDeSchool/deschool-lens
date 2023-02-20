package mongo

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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

func (r *MongoResumeRepository) CheckExistsByAddr(ctx context.Context, address string) bool {
	// 查询条件
	filter := bson.D{
		{Key: "address", Value: address},
	}
	var result hackathon.Resume
	err := r.Collection(ctx).Col().FindOne(ctx, filter).Decode(&result)

	// 不存在
	if err == mongo.ErrNoDocuments {
		return false
	} else {
		errx.CheckError(err)
	}
	return true
}
