package mongo

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
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
