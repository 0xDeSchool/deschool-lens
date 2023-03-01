package internal

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/server"
	"github.com/0xdeschool/deschool-lens/backend/internal/store/mongo"
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
)

func BoothServer(builder *app.AppBuilder) {
	builder.Use(server.HttpServer)
	builder.Use(mongo.MongoStore)
}
