package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
)

func Module(sb *server.ServerBuiler) {
	ab := sb.App
	ab.ConfigureServices(func() error {
		di.AddTransient(NewUserManager)
		return nil
	})
	identityController(sb)
}
