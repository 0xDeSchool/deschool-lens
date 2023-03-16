package resume

import "strings"

type ProjectCreateInput struct {
	Name        string `json:"name" binding:"required"`
	Url         string `json:"url"`
	Description string `json:"description"`
}

func (p *ProjectCreateInput) ToEntity() *Project {
	return &Project{
		Name:           p.Name,
		Url:            p.Url,
		Description:    p.Description,
		NormalizedName: strings.ToUpper(p.Name),
	}
}

type ProjectDto struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Url         string `json:"url"`
	Description string `json:"description"`
}

func NewProjectDto(p *Project) *ProjectDto {
	return &ProjectDto{
		Id:          p.ID.Hex(),
		Name:        p.Name,
		Url:         p.Url,
		Description: p.Description,
	}
}

type RoleCreateInput struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

func (p *RoleCreateInput) ToEntity() *Role {
	return &Role{
		Name:           p.Name,
		Description:    p.Description,
		NormalizedName: strings.ToUpper(p.Name),
	}
}

type RoleDto struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func NewRoleDto(p *Role) *RoleDto {
	return &RoleDto{
		Id:          p.ID.Hex(),
		Name:        p.Name,
		Description: p.Description,
	}
}
