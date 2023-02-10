package internal

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
)

func DeSchoolLensServer(builder *app.AppBuilder) {
	builder.Use(httpServerInit)
}

func httpServerInit(builder *app.AppBuilder) {
	const LAST_RUN_ORDER = 999
	sb := server.NewServerBuilder(builder)

	builder.OrderRun(LAST_RUN_ORDER, func() error {
		s, err := sb.Build()
		errx.CheckError(err)
		return s.Run()
	})
}
