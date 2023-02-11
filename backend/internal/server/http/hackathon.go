package http

import (
	"net/http"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/gin-gonic/gin"
)

func HackathonModAndApi(sb *server.ServerBuiler) {
	// 添加 Hackathon Module
	di.TryAddTransient(hackathon.NewHackathonManager)

	// 在 Server 中添加 Hackathon 模块的各个 Route
	sb.Configure(func(s *server.Server) error {
		baseRoute := s.G.Group("/api")
		baseRoute.GET("/ping", pingHandler)
		return nil
	})
}

func pingHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	data := hm.SayHello(ctx)
	ctx.JSON(http.StatusOK, data)
}
