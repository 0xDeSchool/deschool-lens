package http

import (
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

	// Add all module and api here
	HackathonModAndApi(sb)

	// Run http server up
	builder.OrderRun(LAST_RUN_ORDER, func() error {
		s, err := sb.Build()
		errx.CheckError(err)
		return s.Run()
	})
}
