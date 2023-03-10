package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/0xdeschool/deschool-lens/backend/pkg/x"
	"github.com/ethereum/go-ethereum/common"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoUserRepository struct {
	*MongoRepositoryBase[identity.User]
}

func NewMongoUserRepository(c *di.Container) *identity.UserRepository {
	var repo identity.UserRepository = &MongoUserRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[identity.User]("users"),
	}
	return &repo
}

func (m *MongoUserRepository) Find(ctx context.Context, address common.Address) *identity.User {
	filter := bson.D{{"address", address.Hex()}}
	users := m.MongoRepositoryBase.Find(ctx, filter)
	if len(users) == 0 {
		return nil
	}
	return &users[0]
}

func (m *MongoUserRepository) GetManyByAddr(ctx context.Context, addresses []common.Address) []identity.User {
	addrs := linq.Map(addresses, func(addr *common.Address) string { return addr.Hex() })
	filter := bson.D{{"address", bson.D{{"$in", addrs}}}}
	return m.MongoRepositoryBase.Find(ctx, filter)
}

func (m *MongoUserRepository) LinkPlatform(ctx context.Context, p *identity.UserPlatform) {
	filter := bson.D{
		{"userId", p.UserId},
		{"address", p.Address},
		{"handle", p.Handle},
		{"platform", p.Platform},
	}
	m.userPlatforms(ctx).UpdateOne(ctx, filter, p, options.Update().SetUpsert(true))
}

func (m *MongoUserRepository) UnlinkPlatform(ctx context.Context, userId primitive.ObjectID, address common.Address, handle string, platform identity.UserPlatformType) int {
	filter := bson.D{
		{"userId", userId},
		{"address", address.Hex()},
		{"handle", handle},
		{"platform", platform},
	}
	result, err := m.userPlatforms(ctx).Col().DeleteMany(ctx, filter)
	errx.CheckError(err)
	return int(result.DeletedCount)
}

func (m *MongoUserRepository) GetManyPlatforms(ctx context.Context, userIds []primitive.ObjectID) []identity.UserPlatform {
	if len(userIds) == 0 {
		return []identity.UserPlatform{}
	}
	filter := bson.D{{"userId", bson.D{{"$in", userIds}}}}
	return m.userPlatforms(ctx).Find(ctx, filter)
}

func (m *MongoUserRepository) GetPlatforms(ctx context.Context, userId primitive.ObjectID) []identity.UserPlatform {
	filter := bson.D{{"userId", userId}}
	return m.userPlatforms(ctx).Find(ctx, filter)
}

func (m *MongoUserRepository) GetUsers(ctx context.Context, q *string, platform *identity.UserPlatformType, p *x.PageAndSort) []identity.User {
	if platform != nil {
		return m.filterByPlatform(ctx, q, *platform, p)
	} else {
		return m.filterByUpdate(ctx, q, p)
	}
	//sort := m.ParseSort(p)
	//opts := options.Find().SetSort(sort).SetLimit(p.Limit()).SetSkip(p.Skip())
	//return m.MongoRepositoryBase.Find(ctx, bson.D{}, opts)
}

// GetManyByAddr 通过简历更新时间排序
func (m *MongoUserRepository) filterByUpdate(ctx context.Context, q *string, p *x.PageAndSort) []identity.User {
	filter := bson.D{}
	if q != nil {
		filter = bson.D{
			{"$or", bson.A{
				bson.D{{Key: "displayName", Value: bson.D{{Key: "$regex", Value: *q}}}},
				bson.D{{Key: "address", Value: bson.D{{Key: "$regex", Value: *q}}}},
			}}}
	}
	match := bson.D{{Key: "$match", Value: filter}}
	lookup := bson.D{{Key: "$lookup", Value: bson.D{
		{Key: "from", Value: "resume"},
		{Key: "localField", Value: "_id"},
		{Key: "foreignField", Value: "userId"},
		{Key: "let", Value: bson.M{"updatedAt": "$updatedAt"}},
		{Key: "pipeline", Value: bson.A{
			bson.D{{Key: "$project", Value: bson.M{"updatedAt": 1}}},
		}},
		{Key: "as", Value: "resumes"},
	}}}
	skip := bson.D{{Key: "$skip", Value: (p.Page - 1) * p.PageSize}}
	limit := bson.D{{Key: "$limit", Value: p.PageSize}}
	sort := bson.D{{Key: "$sort", Value: bson.M{"resumes.0.updatedAt": -1}}}
	pipe := mongo.Pipeline{match, lookup, sort, skip, limit}
	cur, err := m.Collection(ctx).Col().Aggregate(ctx, pipe)
	errx.CheckError(err)
	data := make([]identity.User, 0)
	errx.CheckError(cur.All(ctx, &data))
	return data
}

// GetManyByAddr 通过平台筛选，注册时间排序
func (m *MongoUserRepository) filterByPlatform(ctx context.Context, q *string, platform identity.UserPlatformType, p *x.PageAndSort) []identity.User {
	filter := bson.D{}
	if q != nil {
		filter = bson.D{{Key: "name", Value: bson.D{{Key: "$regex", Value: q}}}}
	}
	match := bson.D{{Key: "$match", Value: filter}}
	lookup := bson.D{{Key: "$lookup", Value: bson.D{
		{Key: "from", Value: "user_platforms"},
		{Key: "localField", Value: "_id"},
		{Key: "foreignField", Value: "userId"},
		{Key: "let", Value: bson.M{"platform": "$platform"}},
		{Key: "pipeline", Value: bson.A{
			bson.D{{Key: "$match", Value: bson.M{"platform": platform}}},
			bson.D{{Key: "$project", Value: bson.M{"platform": 1}}},
		}},
		{Key: "as", Value: "platforms"},
	}}}
	match2 := bson.D{{Key: "$match", Value: bson.D{
		{Key: "platforms.0.platform", Value: platform},
	}}}
	sortValue := m.ParseSort(p)
	skip := bson.D{{Key: "$skip", Value: (p.Page - 1) * p.PageSize}}
	limit := bson.D{{Key: "$limit", Value: p.PageSize}}
	sort := bson.D{{Key: "$sort", Value: sortValue}}
	pipe := mongo.Pipeline{match, lookup, match2, sort, skip, limit}
	cur, err := m.Collection(ctx).Col().Aggregate(ctx, pipe)
	errx.CheckError(err)
	data := make([]identity.User, 0)
	errx.CheckError(cur.All(ctx, &data))
	return data
}

func (m *MongoUserRepository) userPlatforms(ctx context.Context) *mongodb.Collection[identity.UserPlatform] {
	c := m.MongoRepositoryBase.GetCollection(ctx, "user_platforms")
	col := mongodb.NewCollection[identity.UserPlatform](c)
	return col
}
