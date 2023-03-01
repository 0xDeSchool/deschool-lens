package server

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/auth"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/internal/server/http"
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
)

func HttpServer(ab *app.AppBuilder) {
	// LastRunOrder Init params
	const LastRunOrder = 999

	sb := server.NewServerBuilder(ab)
	sb.Add(auth.AddAuth)
	sb.Add(identity.IdentityModule)
	sb.Add(http.Init)

	// Run http server up
	ab.OrderRun(LastRunOrder, func() error {
		s, err := sb.Build()
		errx.CheckError(err)
		return s.Run()
	})
}
