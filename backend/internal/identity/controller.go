package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/gin-gonic/gin"
)

func identityController(sb *server.ServerBuiler) {
	sb.Configure(func(s *server.Server) error {
		s.Route.POST("identity/link", linkPlatform)
		return nil
	})
}

func linkPlatform(ctx *gin.Context) {

}
