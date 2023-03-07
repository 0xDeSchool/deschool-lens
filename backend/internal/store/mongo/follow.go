package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

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

func (r *MongoFollowRepository) CheckExistsByToAndFromAddr(ctx context.Context, fromUser primitive.ObjectID, toUser primitive.ObjectID) bool {
	// 查询条件
	filter := bson.D{{
		Key:   "fromUser",
		Value: fromUser,
	}, {
		Key:   "toUser",
		Value: toUser,
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

func (r *MongoFollowRepository) GetListByFilter(ctx context.Context, userId primitive.ObjectID, key string) []hackathon.Follow {
	// 查询条件
	filter := bson.D{{
		Key:   key,
		Value: userId,
	}}
	return r.Find(ctx, filter)
}

func (r *MongoFollowRepository) DeleteByToAndFrom(ctx context.Context, fromUser primitive.ObjectID, toUser primitive.ObjectID) bool {
	// 查询条件
	filter := bson.D{{
		Key:   "toUser",
		Value: toUser,
	}, {
		Key:   "fromUser",
		Value: fromUser,
	}}
	r.Collection(ctx).Col().DeleteOne(ctx, filter)
	return true
}

func (r *MongoFollowRepository) GetFollowingUsers(ctx context.Context, userId primitive.ObjectID) []primitive.ObjectID {
	// 查询条件
	filter := bson.D{{
		Key:   "fromUser",
		Value: userId,
	}}
	opts := options.Find().SetProjection(bson.D{{Key: "toUser", Value: 1}})
	data := r.Find(ctx, filter, opts)
	return linq.Map(data, func(i *hackathon.Follow) primitive.ObjectID {
		return i.ToUser
	})
}

type countResult struct {
	Id    primitive.ObjectID `bson:"_id"`
	Count int                `bson:"count"`
}

// GetFollowingCount 获取关注数
func (r *MongoFollowRepository) GetFollowingCount(ctx context.Context, userIds []primitive.ObjectID) map[primitive.ObjectID]int {
	return r.CountUsers(ctx, userIds, false)
}
func (r *MongoFollowRepository) GetFollowerCount(ctx context.Context, userIds []primitive.ObjectID) map[primitive.ObjectID]int {
	return r.CountUsers(ctx, userIds, true)
}
func (r *MongoFollowRepository) CheckIsFollowing(ctx context.Context, userId primitive.ObjectID, ids []primitive.ObjectID) map[primitive.ObjectID]bool {
	filter := bson.D{
		{"fromUser", userId},
		{"toUser", bson.M{"$in": ids}},
	}
	data := r.Find(ctx, filter)
	result := make(map[primitive.ObjectID]bool)
	for _, v := range ids {
		result[v] = false
	}
	for _, v := range data {
		result[v.ToUser] = true
	}
	return result
}

func (r *MongoFollowRepository) CountUsers(ctx context.Context, userIds []primitive.ObjectID, isTo bool) map[primitive.ObjectID]int {
	// 查询条件
	key := "fromUser"
	if isTo {
		key = "toUser"
	}
	match := bson.D{
		{"$match", bson.D{{key, bson.M{"$in": userIds}}}},
	}
	group := bson.D{{"$group", bson.D{
		{"_id", "$fromUser"},
		{"count", bson.D{{"$sum", 1}}},
	}}}
	pipeline := mongo.Pipeline{match, group}
	cur, err := r.Collection(ctx).Col().Aggregate(ctx, pipeline)
	errx.CheckError(err)
	countResult := make([]countResult, 0)
	err = cur.All(ctx, &countResult)
	errx.CheckError(err)
	result := make(map[primitive.ObjectID]int)

	for _, v := range userIds {
		result[v] = 0
	}
	for _, v := range countResult {
		result[v.Id] = v.Count
	}
	return result
}
