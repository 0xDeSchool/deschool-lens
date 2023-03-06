package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/0xdeschool/deschool-lens/backend/pkg/x"
	"github.com/ethereum/go-ethereum/common"
	"go.mongodb.org/mongo-driver/bson"
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
	m.userPlatforms(ctx).Insert(ctx, p)
}

func (m *MongoUserRepository) UnlinkPlatform(ctx context.Context, address common.Address, handle string, platform string) {
	filter := bson.D{
		{"address", address.Hex()},
		{"handle", handle},
		{"platform", platform}}
	m.userPlatforms(ctx).Col().DeleteMany(ctx, filter)
}

func (m *MongoUserRepository) GetPlatforms(ctx context.Context, address common.Address) []identity.UserPlatform {
	filter := bson.D{{"address", address.Hex()}}
	return m.userPlatforms(ctx).Find(ctx, filter)
}

func (m *MongoUserRepository) GetLatestUsers(ctx context.Context, p *x.PageAndSort) []identity.User {
	sort := m.ParseSort(p)
	opts := options.Find().SetSort(sort).SetLimit(p.Limit()).SetSkip(p.Skip())
	return m.MongoRepositoryBase.Find(ctx, bson.D{}, opts)
}

func (m *MongoUserRepository) userPlatforms(ctx context.Context) *mongodb.Collection[identity.UserPlatform] {
	c := m.MongoRepositoryBase.GetCollection(ctx, "user_platforms")
	col := mongodb.NewCollection[identity.UserPlatform](c)
	return col
}
