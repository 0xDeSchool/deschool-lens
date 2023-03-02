package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/gin-gonic/gin"
	"net/http"
)

func identityController(sb *server.ServerBuiler) {
	auth := ginx.AuthHandlerFunc(sb)
	sb.Configure(func(s *server.Server) error {
		s.Route.POST("identity/link", auth, linkPlatform)
		return nil
	})
}

func linkPlatform(ctx *gin.Context) {
	var input LinkPlatformInput
	errx.CheckError(ctx.BindJSON(&input))
	currentUser := ginx.CurrentUser(ctx)
	if !currentUser.Authenticated() {
		ginx.PanicUnAuthenticated("unauthenticated")
	}
	data := input.ToEntity()
	data.Address = currentUser.Address
	um := di.Get[UserManager]()
	um.Link(ctx, data)
	ctx.JSON(http.StatusOK, data)
}
