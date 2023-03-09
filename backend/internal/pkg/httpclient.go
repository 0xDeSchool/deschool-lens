package pkg

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils"
)

func AddHttpClient(ac *app.AppBuilder) {
	ac.ConfigureServices(func() error {
		var httpOptions = &ginx.HttpClientOptions{}
		utils.ViperBind("HttpClient", httpOptions)
		di.TryAddValue(httpOptions)
		di.TryAddTransient(func(c *di.Container) *ginx.RequestClient {
			options := di.Get[ginx.HttpClientOptions]()
			client := ginx.NewRequestClient(options)
			return client
		})
		return nil
	})
}
