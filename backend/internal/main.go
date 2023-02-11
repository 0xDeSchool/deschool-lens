package internal

import (
	httpserver "github.com/0xdeschool/deschool-lens/backend/internal/server/http"
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
)

func LensHackathonServer(builder *app.AppBuilder) {
	builder.Use(httpserver.Init)
}
