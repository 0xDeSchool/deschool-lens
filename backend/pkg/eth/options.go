package eth

import (
	"regexp"

	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/ethereum/go-ethereum/common"
)

type EthOptions struct {
	DailUrl string
	Main    *EthClientConfig
	Polygon *EthClientConfig
}

func (eo *EthOptions) GetEthConfig(chainId string) *EthClientConfig {
	var config *EthClientConfig
	if eo.Main != nil && eo.Main.ChainId == chainId {
		config = eo.Main
	} else if eo.Polygon != nil && eo.Polygon.ChainId == ChianId_Polygon {
		config = eo.Polygon
	}
	return config
}

type EthClientConfig struct {
	ChainId string
	Url     string
}

func NewEthOptions() *EthOptions {
	return &EthOptions{
		DailUrl: "",
	}
}

func CheckAddress(addr string) {
	re := regexp.MustCompile("^0x[0-9a-fA-F]{40}$")
	result := re.MatchString(addr)
	if !result {
		ginx.PanicValidatition(addr + " is not an addrress format")
	}
}

func NormalizeAddress(addr string) string {
	CheckAddress(addr)
	return common.HexToAddress(addr).Hex()
}
