package resume

import "github.com/0xdeschool/deschool-lens/backend/pkg/ddd"

const (
	ProjectCollectionName = "resume_projects"
	RoleCollectionName    = "resume_roles"
	NormalizedNameField   = "normalizedName"
)

type Project struct {
	ddd.AuditEntityBase `bson:",inline"`
	Name                string `bson:"name"`
	NormalizedName      string `bson:"normalizedName"`
	Icon                string `bson:"icon"`
	Description         string `bson:"description"`
	Url                 string `bson:"url"`
}

type Role struct {
	ddd.AuditEntityBase `bson:",inline"`
	Name                string `bson:"name"`
	NormalizedName      string `bson:"normalizedName"`
	Description         string `bson:"description"`
}

type ProjectRepository interface {
	ddd.Repository[Project]
}

type RoleRepository interface {
	ddd.Repository[Role]
}
