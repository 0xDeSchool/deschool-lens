package moralis

import (
	"fmt"
	"strconv"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
)

type SyncStatus string

const (
	StatusSyncing SyncStatus = "SYNCING"
	StatusSynced  SyncStatus = "SYNCED"
)

type NFTResult struct {
	Total  int64     `json:"total"`
	Cursor string    `json:"cursor"`
	Result []NFTItem `json:"result"`
}

type NFTItem struct {
	Address  string      `json:"token_address"`
	TokenId  string      `json:"token_id"`
	Amount   string      `json:"amount"`
	Metadata NFTMetadata `json:"normalized_metadata"`
	Name     string      `json:"name"`
	OwnerOf  string      `json:"owner_of"`
}

type NFTMetadata struct {
	Name         string `json:"name"`
	Description  string `json:"description"`
	Image        string `json:"image"`
	ExternalLink string `json:"external_link"`
}

func (mc *Client) GetNFTsByAddr(addr string) {
}

func (mc *Client) OwnersOfContract(contract string, limit int, cursor *string) (*NFTResult, error) {
	path := "/nft/" + contract + "/owners"
	var result = NFTResult{}
	query := map[string]string{
		"limit":             strconv.Itoa(limit),
		"normalizeMetadata": "true",
	}
	if cursor != nil {
		query["cursor"] = *cursor
	}
	err := mc.get(path, query, &result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (mc *Client) GetOwnersByTokenId(contract string, tokenId string, limit int, cursor *string) (*NFTResult, error) {
	errx.NotEmpty(tokenId, "tokenId")
	errx.NotEmpty(contract, "contract")
	path := fmt.Sprintf("/nft/%s/%s/owners", contract, tokenId)
	var result = NFTResult{}
	query := map[string]string{
		"limit":             strconv.Itoa(limit),
		"normalizeMetadata": "true",
	}
	if cursor != nil {
		query["cursor"] = *cursor
	}
	err := mc.get(path, query, &result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
