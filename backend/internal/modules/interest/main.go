package interest

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
)

func InterestModule(sb *server.ServerBuiler) {
	sb.Configure(func(s *server.Server) error {
		httpApi(s)
		return nil
	})
}
