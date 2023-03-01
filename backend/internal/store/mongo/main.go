package mongo

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils"
	"go.mongodb.org/mongo-driver/mongo"
)

func MongoStore(builder *app.AppBuilder) {
	AddMongoClient(builder)
}

func AddMongoClient(builder *app.AppBuilder) {
	builder.ConfigureServices(func() error {
		var mongoOptions = &mongodb.MongoOptions{
			URL: "mongodb://localhost:27017",
		}
		utils.ViperBind("Mongo", mongoOptions)
		di.TryAddValue(mongoOptions)
		di.TryAddTransient(func(c *di.Container) *mongo.Client {
			client, err := mongodb.GetClient(mongoOptions)
			errx.CheckError(err)
			return client
		})
		// di.TryAddTransient(NewMongoUnitWork)
		return nil
	})
	builder.PostRun(func() error {
		client := di.Get[mongo.Client]()
		return client.Disconnect(context.Background())
	})
	AddRepositories(builder)
}

func AddRepositories(builder *app.AppBuilder) {
	builder.ConfigureServices(func() error {
		di.AddTransient(NewMongoIdRepository)
		di.AddTransient(NewMongoQ11eRepository)
		di.AddTransient(NewMongoResumeRepository)
		di.AddTransient(NewMongoFollowRepository)
		di.AddTransient(NewMongoUserRepository)
		return nil
	})
}
