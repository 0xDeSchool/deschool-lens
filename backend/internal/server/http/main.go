package http

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils"
)

func Init(builder *app.AppBuilder) {
	// Init params
	const LAST_RUN_ORDER = 999
	sb := server.NewServerBuilder(builder)

	// Add Server Configuration data in App pre-run step
	sb.App.PreRun(func() error {
		utils.ViperBind("Server", sb.Options)
		di.AddValue(sb.Options)
		return nil
	})

	// 添加 Hackathon Module
	builder.Run(func() error {
		di.TryAddTransient(hackathon.NewHackathonManager)
		return nil
	})

	// Add all module and api here
	HackathonModAndApi(sb)

	// Run http server up
	builder.OrderRun(LAST_RUN_ORDER, func() error {
		s, err := sb.Build()
		errx.CheckError(err)
		return s.Run()
	})
}

func HackathonModAndApi(sb *server.ServerBuiler) {

	// 在 Server 中添加 Hackathon 模块的各个 Route
	sb.Configure(func(s *server.Server) error {
		baseRoute := s.G.Group("/api")
		baseRoute.GET("/ping", pingHandler)
		baseRoute.GET("/resume", resumeGetHandler)
		baseRoute.PUT("/resume", resumePutHandler)
		baseRoute.GET("/sbt", sbtDetailGetHandler)
		baseRoute.PUT("/q11e", q11ePutHandler)
		baseRoute.GET("/id/list", idListHandler)
		baseRoute.POST("/id/validate", idValidateHandler)
		baseRoute.POST("/id/recommendation", q11ePutHandler)
		baseRoute.GET("/id/recommendation", recommendationGetHandler)
		baseRoute.GET("/id/sbt", idSbtDetailGetHandler)
		return nil
	})
}
