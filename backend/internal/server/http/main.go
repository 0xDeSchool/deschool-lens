package http

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils"
)

func Init(sb *server.ServerBuiler) {
	builder := sb.App
	// Add Server Configuration data in App pre-run step
	sb.App.PreRun(func() error {
		utils.ViperBind("Server", sb.Options)
		di.AddValue(sb.Options)
		return nil
	})

	// 添加 Hackathon Module
	builder.ConfigureServices(func() error {
		options := &hackathon.HackathonOptions{}
		utils.ViperBind("Hackathon", options)
		di.AddValue(options)

		di.TryAddTransient(hackathon.NewHackathonManager)
		return nil
	})

	// Add all module and api here
	HackathonApi(sb)

}

func HackathonApi(sb *server.ServerBuiler) {

	// 在 Server 中添加 Hackathon 模块的各个 Route
	sb.Configure(func(s *server.Server) error {
		baseRoute := s.Route.Group("/api")

		// Stage 1 - 基础框架 + 身份
		baseRoute.GET("/ping", pingHandler)
		baseRoute.POST("/id/validate", idValidateHandler)
		baseRoute.GET("/id/list", idListHandler)
		baseRoute.GET("/id/new", idNewHandle)

		// Stage 2 - 简历 + 技能
		baseRoute.GET("/resume", resumeGetHandler)
		baseRoute.PUT("/resume", resumePutHandler)
		baseRoute.GET("/id/sbt", idSbtDetailGetHandler)

		// Stage 3 - 推荐 + 互联
		baseRoute.GET("/sbt", sbtDetailGetHandler)
		baseRoute.PUT("/q11e", q11ePutHandler)
		baseRoute.GET("/q11e", q11eGetHandler)
		baseRoute.GET("/id/recommendation", recommendationGetHandler)

		// Stage 4 - 测试
		// baseRoute.POST("/test/sbt", testSbtPostHandler)

		// Stage 5 - 临时
		baseRoute.GET("/follow", followGetHandler)
		baseRoute.POST("/follow", followPostHandler)
		baseRoute.GET("/follow/following", followingGetHandler)
		baseRoute.GET("/follow/follower", followerGetHandler)
		baseRoute.DELETE("/follow", followDeleteHandler)

		baseRoute.POST("/events", filterEvents)

		baseRoute.GET("users", getUsers)
		return nil
	})
}
