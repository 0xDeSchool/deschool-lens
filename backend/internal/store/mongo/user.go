package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"go.mongodb.org/mongo-driver/bson"
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

func (m *MongoUserRepository) Find(ctx context.Context, address string) *identity.User {
	filter := bson.D{{"address", address}}
	users := m.MongoRepositoryBase.Find(ctx, filter)
	if len(users) == 0 {
		return nil
	}
	return &users[0]
}

func (m *MongoUserRepository) GetMany(ctx context.Context, addresses []string) []identity.User {
	filter := bson.D{{"address", bson.D{{"$in", addresses}}}}
	return m.MongoRepositoryBase.Find(ctx, filter)
}

func (m *MongoUserRepository) LinkPlatform(ctx context.Context, p *identity.UserPlatform) {
	m.userPlatforms(ctx).Insert(ctx, p)
}

func (m *MongoUserRepository) UnlinkPlatform(ctx context.Context, address string, handle string, platform string) {
	filter := bson.D{
		{"address", address},
		{"handle", handle},
		{"platform", platform}}
	m.userPlatforms(ctx).Col().DeleteMany(ctx, filter)
}

func (m *MongoUserRepository) GetPlatforms(ctx context.Context, address string) []identity.UserPlatform {
	filter := bson.D{{"address", address}}
	return m.userPlatforms(ctx).Find(ctx, filter)
}

func (m *MongoUserRepository) userPlatforms(ctx context.Context) *mongodb.Collection[identity.UserPlatform] {
	c := m.MongoRepositoryBase.GetCollection(ctx, "user_platforms")
	col := mongodb.NewCollection[identity.UserPlatform](c)
	return col
}
