package eth

import (
	"strconv"

	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

const BaseURL = "https://api.polygonscan.com/api"

type Filter struct {
	From    uint64
	To      *uint64
	Address *common.Address
	Topic0  *common.Hash
}

type dataResult[T any] struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Result  T      `json:"result"`
}

type PolygonscanClient struct {
	apiKey string
	client *ginx.RequestClient
}

func NewPolygonscanClient(apiKey string) *PolygonscanClient {
	return &PolygonscanClient{
		apiKey: apiKey,
		client: di.Get[ginx.RequestClient](),
	}
}

func (pc *PolygonscanClient) GetLogs(filter *Filter) []types.Log {
	if filter == nil {
		panic("filter must be not nil")
	}
	if filter.Address == nil {
		panic("filter.Address must be not nil")
	}
	url := BaseURL + "?module=logs&action=getLogs&address=" + filter.Address.Hex()
	if filter.Topic0 != nil {
		url = url + "&topic0=" + filter.Topic0.Hex()
	}
	url = url + "&fromBlock=" + strconv.Itoa(int(filter.From))
	if filter.To != nil {
		url = url + "&toBlock=" + strconv.Itoa(int(*filter.To))
	} else {
		url = url + "&toBlock=latest"
	}
	var data dataResult[[]types.Log]
	err := pc.client.GetObj(url, &data)
	errx.CheckError(err)
	return data.Result
}
