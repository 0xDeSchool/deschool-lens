package server

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/auth"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/internal/server/http"
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/gin-contrib/logger"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
)

func HttpServer(ab *app.AppBuilder) {
	// LastRunOrder Init params
	const LastRunOrder = 999

	sb := server.NewServerBuilder(ab)
	sb.Add(addLogAndErrorHandlers)
	sb.Add(auth.AddAuth)
	sb.Add(identity.Module)
	sb.Add(http.Init)

	// Run http server up
	ab.OrderRun(LastRunOrder, func() error {
		s, err := sb.Build()
		errx.CheckError(err)
		return s.Run()
	})
}

func addLogAndErrorHandlers(sb *server.ServerBuiler) {
	sb.PreConfigure(func(s *server.Server) error {
		s.Route.Use(Log(sb.Options.LogLevel))
		s.Route.Use(ginx.ErrorMiddleware)
		s.Route.Use(ginx.UnitWorkMiddleware())
		return nil
	})
}

func Log(lvl zerolog.Level) gin.HandlerFunc {
	return logger.SetLogger(
		logger.WithDefaultLevel(lvl),
	)
}
