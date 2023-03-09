package interest

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/gin-gonic/gin"
	"time"
)

func httpApi(s *server.Server) {
	s.Route.POST("/api/interest", createInterest)
	s.Route.DELETE("/api/interest", cancelInterest)

}

func cancelInterest(ctx *gin.Context) {
	var input CreateInput
	errx.CheckError(ctx.BindJSON(&input))
	repo := *di.Get[Repository]()
	count := repo.DeleteBy(ctx, mongodb.IDFromHex(input.UserId), input.TargetId, input.TargetType)
	ginx.EntityUpdated(ctx, count)
}

func createInterest(ctx *gin.Context) {
	var input CreateInput
	errx.CheckError(ctx.BindJSON(&input))
	entity := input.ToEntity()
	entity.CreatedAt = time.Now()
	repo := *di.Get[Repository]()
	count := repo.SetInterest(ctx, entity)
	ginx.EntityUpdated(ctx, count)
}
