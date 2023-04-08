package pkg

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/eth"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils"
	"github.com/ethereum/go-ethereum/ethclient"
)

func AddEthClient(ab *app.AppBuilder) {
	ab.ConfigureServices(func() error {
		var ethOptions = eth.NewEthOptions()
		di.TryAddValue(ethOptions)
		utils.ViperBind("EthClient", ethOptions)
		di.TryAddTransient(func(c *di.Container) *ethclient.Client {
			options := di.Get[eth.EthOptions]()
			client, err := eth.GetClient(options)
			errx.CheckError(err)
			return client
		})
		di.TryAddSingleton(func(c *di.Container) *eth.EthClientFactory {
			options := di.Get[eth.EthOptions]()
			return eth.NewEthClientFactory(options)
		})
		return nil
	})
}
