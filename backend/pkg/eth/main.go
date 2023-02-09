package eth

import (
	"sync"

	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	ChainId_Main    string = "1"
	ChianId_Polygon string = "137"
)

var (
	client *ethclient.Client
	once   sync.Once
)

func GetClient(options *EthOptions) (*ethclient.Client, error) {
	var err error = nil
	once.Do(func() {
		client, err = ethclient.Dial(options.DailUrl)
	})
	return client, err
}

type EthClientFactory struct {
	opts    *EthOptions
	clients sync.Map
}

func NewEthClientFactory(options *EthOptions) *EthClientFactory {
	return &EthClientFactory{
		opts:    options,
		clients: sync.Map{},
	}
}

func (ef *EthClientFactory) Create(chainId string) *ethclient.Client {
	config := ef.opts.GetEthConfig(chainId)
	if config == nil {
		return nil
	}
	c, ok := ef.clients.Load(config.ChainId)
	if !ok {
		cl, err := ethclient.Dial(config.Url)
		if err != nil {
			log.Warn("create eth client error", err)
		} else {
			if nc, loaded := ef.clients.LoadOrStore(config.ChainId, cl); loaded {
				c = nc
			} else {
				log.Warn("create eth client error")
			}
		}
	}
	if c == nil {
		return nil
	}
	return c.(*ethclient.Client)
}
