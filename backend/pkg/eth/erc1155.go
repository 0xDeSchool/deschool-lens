package eth

import (
	"context"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/metachris/eth-go-bindings/erc1155"
)

type Erc1155TranferInfo struct {
	Address  common.Address
	Operator common.Address
	From     common.Address
	To       common.Address
	Id       *big.Int
	Value    *big.Int
	Tx       common.Hash
}

type Erc1155TransferHandleFunc func(sub *Erc1155Subscription, logs []*Erc1155TranferInfo)

func parseInfo(t *erc1155.Erc1155TransferSingle) *Erc1155TranferInfo {
	return &Erc1155TranferInfo{
		Address:  t.Raw.Address,
		Operator: t.Operator,
		From:     t.From,
		To:       t.To,
		Id:       t.Id,
		Value:    t.Value,
		Tx:       t.Raw.TxHash,
	}
}

func parseInfoBatch(t *erc1155.Erc1155TransferBatch) []*Erc1155TranferInfo {
	var batch []*Erc1155TranferInfo
	for i := 0; i < len(t.Ids); i++ {
		batch = append(batch, &Erc1155TranferInfo{
			Address:  t.Raw.Address,
			Operator: t.Operator,
			From:     t.From,
			To:       t.To,
			Id:       t.Ids[i],
			Value:    t.Values[i],
			Tx:       t.Raw.TxHash,
		})
	}
	return batch
}

type Erc1155Subscription struct {
	client  *ethclient.Client
	abi     *abi.ABI
	handler Erc1155TransferHandleFunc
}

func NewErc1155TransferWatcher(handler Erc1155TransferHandleFunc) *Erc1155Subscription {
	sub := &Erc1155Subscription{
		client:  di.Get[ethclient.Client](),
		handler: handler,
		abi:     erc1155ABI(),
	}
	return sub
}

func (esub *Erc1155Subscription) Subscribe(addresses []common.Address) {
	for {
		logs := make(chan types.Log)
		sub, err := esub.client.SubscribeFilterLogs(context.Background(), ethereum.FilterQuery{
			Addresses: addresses,
			Topics: [][]common.Hash{
				{
					esub.abi.Events["TransferSingle"].ID,
					esub.abi.Events["TransferBatch"].ID,
				}},
		}, logs)
		if err != nil {
			log.Warn("listen ERC1155 error")
		} else {
			log.Info("start listening ERC1155 [Transfer] event...")
		chanLoop:
			for {
				select {
				case subErr := <-sub.Err():
					if subErr != nil {
						log.Warn("listen ERC1155 error")
						break chanLoop
					}
				case vLog := <-logs:
					defer errx.CatchPanic("handle event log error")
					data := esub.parseLog(&vLog)
					esub.handleTransfer(data)
				}
			}
		}
		sub.Unsubscribe()
		log.Info("10s后开始重连")
		time.Sleep(10 * time.Second)
	}
}

func (sub *Erc1155Subscription) BalanceOf(contract common.Address, account common.Address, tokenId *big.Int) *big.Int {
	bound := bind.NewBoundContract(contract, *sub.abi, sub.client, sub.client, sub.client)
	var out []interface{}
	err := bound.Call(nil, &out, "balanceOf", account, tokenId)
	errx.CheckError(err)
	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	return out0
}

func (sub *Erc1155Subscription) handleTransfer(logs []*Erc1155TranferInfo) {
	log.Info(fmt.Sprintf("recieved Erc1155 transfer event, count: %d", len(logs)))
	if sub.handler != nil {
		defer errx.CatchPanic("handle Erc1155 event error")
		sub.handler(sub, logs)
	}
}

func (sub *Erc1155Subscription) parseLog(l *types.Log) []*Erc1155TranferInfo {
	bound := bind.NewBoundContract(l.Address, *sub.abi, sub.client, sub.client, sub.client)
	var result []*Erc1155TranferInfo
	if l.Topics[0] == sub.abi.Events["TransferSingle"].ID {
		var data erc1155.Erc1155TransferSingle
		err := bound.UnpackLog(&data, "TransferSingle", *l)
		if err != nil {
			log.Warn("UnpackLog ERC1155 event log error")
		}
		data.Raw = *l
		result = []*Erc1155TranferInfo{parseInfo(&data)}
	} else if l.Topics[0] == sub.abi.Events["TransferBatch"].ID {
		var data erc1155.Erc1155TransferBatch
		err := bound.UnpackLog(&data, "TransferBatch", *l)
		if err != nil {
			log.Warn("UnpackLog ERC1155 event log error")
		}
		data.Raw = *l
		result = parseInfoBatch(&data)
	} else {
		log.Warn("erc1155 event log topic is not supported: " + l.Topics[0].Hex())
	}
	return result
}

func erc1155ABI() *abi.ABI {
	a, err := abi.JSON(strings.NewReader(erc1155.Erc1155ABI))
	errx.CheckError(err)
	return &a
}
