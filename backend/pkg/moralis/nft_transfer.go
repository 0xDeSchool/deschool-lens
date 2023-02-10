package moralis

import (
	"fmt"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
)

type TransfersByTokenIdPrarams struct {
	TransfersPrarams
	TokenId string
}

type NftTransferResult struct {
	Total         int64         `json:"total"`
	Page          int64         `json:"page"`
	PageSize      int           `json:"page_size"`
	Cursor        *string       `json:"cursor"`
	BlockExists   bool          `json:"block_exists"`
	IndexComplete bool          `json:"index_complete"`
	Result        []NftTransfer `json:"result"`
}

type NftTransfer struct {
	TokenAddress    string `json:"token_address"`
	TokenID         string `json:"token_id"`
	FromAddress     string `json:"from_address"`
	ToAddress       string `json:"to_address"`
	Value           string `json:"value"`
	Amount          string `json:"amount"`
	ContractType    string `json:"contract_type"`
	BlockNumber     string `json:"block_number"`
	BlockTimestamp  string `json:"block_timestamp"`
	TransactionHash string `json:"transaction_hash"`
	Operator        string `json:"operator"`
}

func (mc *Client) GetTransfersByTokenId(params *TransfersByTokenIdPrarams) (*NftTransferResult, error) {
	errx.NotEmpty(params.TokenId, "tokenId")
	errx.NotEmpty(params.Contract, "contract")
	path := fmt.Sprintf("/nft/%s/%s/transfers", params.Contract, params.TokenId)
	var result NftTransferResult
	err := mc.get(path, params.Query(), &result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

type TransfersPrarams struct {
	RequestParams
	Contract string
}

func (mc *Client) GetTransfersByContract(params *TransfersPrarams) (*NftTransferResult, error) {
	errx.NotEmpty(params.Contract, "contract")
	path := fmt.Sprintf("/nft/%s/transfers", params.Contract)
	var result NftTransferResult
	err := mc.get(path, params.Query(), &result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
