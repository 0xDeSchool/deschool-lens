package resume

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func HttpApiModule(sb *server.ServerBuiler) {
	sb.Configure(func(s *server.Server) error {
		group := s.Route.Group("api/resume/projects")
		group.POST("", setProject)
		group.GET("", getProjects)

		group2 := s.Route.Group("api/resume/roles")
		group2.POST("", insertRole)
		group2.GET("", getRole)
		return nil
	})
}

func getProjects(ctx *gin.Context) {
	name := ctx.Query("query")
	page := ginx.QueryPageAndSort(ctx)
	repo := *di.Get[ProjectRepository]()
	projects := make([]Project, 0)
	page.PageSize += 1
	hasNext := false
	if name == "" {
		projects, _ = repo.GetPagedList(ctx, page)
	} else {
		projects = repo.FindByRegex(ctx, NormalizedNameField, strings.ToUpper(name), page)
	}
	if len(projects) > int(page.PageSize)-1 {
		hasNext = true
		projects = projects[:len(projects)-1]
	}
	data := linq.Map(projects, func(p *Project) *ProjectDto { return NewProjectDto(p) })
	result := ddd.NewPagedItems(data, hasNext)
	ctx.JSON(http.StatusOK, &result)
}

func setProject(ctx *gin.Context) {
	var input ProjectCreateInput
	errx.CheckError(ctx.BindJSON(&input))
	repo := *di.Get[ProjectRepository]()
	if repo.ExistsByField(ctx, NormalizedNameField, strings.ToUpper(input.Name)) {
		ginx.PanicValidatition("project name:" + input.Name + " already exists")
	}
	project := input.ToEntity()
	id := repo.Insert(ctx, project)
	ginx.EntityCreated(ctx, id.Hex())
}

func getRole(ctx *gin.Context) {
	name := ctx.Query("query")
	page := ginx.QueryPageAndSort(ctx)
	repo := *di.Get[RoleRepository]()
	page.PageSize += 1
	hasNext := false
	roles := make([]Role, 0)
	if name == "" {
		roles, _ = repo.GetPagedList(ctx, page)
	} else {
		roles = repo.FindByRegex(ctx, NormalizedNameField, strings.ToUpper(name), page)
	}
	if len(roles) > int(page.PageSize)-1 {
		hasNext = true
		roles = roles[:len(roles)-1]
	}
	data := linq.Map(roles, func(p *Role) *RoleDto { return NewRoleDto(p) })
	result := ddd.NewPagedItems(data, hasNext)
	ctx.JSON(http.StatusOK, &result)
}

func insertRole(ctx *gin.Context) {
	var input RoleCreateInput
	errx.CheckError(ctx.BindJSON(&input))
	repo := *di.Get[RoleRepository]()
	if repo.ExistsByField(ctx, NormalizedNameField, strings.ToUpper(input.Name)) {
		ginx.PanicValidatition("role name:" + input.Name + " already exists")
	}
	role := input.ToEntity()
	id := repo.Insert(ctx, role)
	ginx.EntityCreated(ctx, id.Hex())
}
