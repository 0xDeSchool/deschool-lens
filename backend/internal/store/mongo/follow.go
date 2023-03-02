package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

const FollowCollectionName = "follow"

type MongoFollowRepository struct {
	*MongoRepositoryBase[hackathon.Follow]
}

func NewMongoFollowRepository(c *di.Container) *hackathon.FollowRepository {
	var repo hackathon.FollowRepository = &MongoFollowRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[hackathon.Follow](FollowCollectionName),
	}
	return &repo
}

func (r *MongoFollowRepository) CheckExistsByToAndFromAddr(ctx context.Context, fromAddr string, toAddr string) bool {
	// 查询条件
	filter := bson.D{{
		Key:   "fromAddr",
		Value: fromAddr,
	}, {
		Key:   "toAddr",
		Value: toAddr,
	}}
	var result hackathon.Follow
	err := r.Collection(ctx).Col().FindOne(ctx, filter).Decode(&result)

	// 不存在
	if err == mongo.ErrNoDocuments {
		return false
	} else {
		errx.CheckError(err)
	}
	return true
}

func (r *MongoFollowRepository) GetListByFilter(ctx context.Context, addr string, key string) []hackathon.Follow {
	// 查询条件
	filter := bson.D{{
		Key:   key,
		Value: addr,
	}}
	return r.Find(ctx, filter)
}

func (r *MongoFollowRepository) DeleteByToAndFrom(ctx context.Context, fromAddr string, toAddr string) bool {
	// 查询条件
	filter := bson.D{{
		Key:   "toAddr",
		Value: toAddr,
	}, {
		Key:   "fromAddr",
		Value: fromAddr,
	}}
	r.Collection(ctx).Col().DeleteOne(ctx, filter)
	return true
}

func (r *MongoFollowRepository) GetFollowingUsers(ctx context.Context, addr string) []string {
	// 查询条件
	filter := bson.D{{
		Key:   "fromAddr",
		Value: addr,
	}}
	data := r.Find(ctx, filter)
	return linq.Map(data, func(i *hackathon.Follow) string {
		return i.ToAddr
	})
}
