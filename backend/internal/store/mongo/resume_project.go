package mongo

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/modules/resume"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
)

type MongoResumeProjectRepository struct {
	*MongoRepositoryBase[resume.Project]
}

func NewMongoProjectRepository(c *di.Container) *resume.ProjectRepository {
	var repo resume.ProjectRepository = &MongoResumeProjectRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[resume.Project](resume.ProjectCollectionName),
	}
	return &repo
}

type MongoResumeRoleRepository struct {
	*MongoRepositoryBase[resume.Role]
}

func NewMongoRoleRepository(c *di.Container) *resume.RoleRepository {
	var repo resume.RoleRepository = &MongoResumeRoleRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[resume.Role](resume.RoleCollectionName),
	}
	return &repo
}
