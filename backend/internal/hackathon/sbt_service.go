package hackathon

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
)

type SbtDetail struct {
	Metadata *NftMetaData
	Owners   []string
}

func (hm *HackathonManager) GetSbtDetail(ctx context.Context, address string, tokenId int) *SbtDetail {
	metadata := getNftMetadata(address, tokenId)
	owners := getOwners(address, tokenId)
	return &SbtDetail{
		Metadata: metadata,
		Owners:   owners,
	}
}

type NftMetaData struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type NftMetaDataOutput struct {
	NormalizedMetadata NftMetaData `json:"normalized_metadata"`
}

func getNftMetadata(address string, tokenId int) *NftMetaData {
	// set up param
	tokenIdStr := strconv.Itoa(tokenId)
	const POLYGON_CHAIN_STR = "polygon"
	// TODO: Move this to config.yaml
	const API_KEY = "JoHVGRL3Rxu3MPjBYdQGlQkEHnjnsKYBF5Ij3RWsaP7Kmz0ZlXZ1Ay7wfrO8tRfd"
	url := fmt.Sprintf("https://deep-index.moralis.io/api/v2/nft/%s/%s/owners?chain=%s&format=decimal&normalizeMetadata=false", address, tokenIdStr, POLYGON_CHAIN_STR)

	// prepare http request
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Accept", "application/json")
	req.Header.Add("X-API-Key", API_KEY)

	// make http request
	res, err := http.DefaultClient.Do(req)
	errx.CheckError(err)
	defer res.Body.Close()
	var output *NftMetaDataOutput

	// unmarshal data structure
	content, err := ioutil.ReadAll(res.Body)
	errx.CheckError(err)
	errx.CheckError(json.Unmarshal(content, output))

	return &output.NormalizedMetadata
}

type NftOwnerResult struct {
	OwnerOf string `json:"owner_of"`
}

type NftOwnerOutput struct {
	Result []NftOwnerResult `json:"result"`
}

func getOwners(address string, tokenId int) []string {

	// set up param
	tokenIdStr := strconv.Itoa(tokenId)
	const POLYGON_CHAIN_STR = "polygon"
	// TODO: Move this to config.yaml
	const API_KEY = "JoHVGRL3Rxu3MPjBYdQGlQkEHnjnsKYBF5Ij3RWsaP7Kmz0ZlXZ1Ay7wfrO8tRfd"

	// prepare http request
	url := fmt.Sprintf("https://deep-index.moralis.io/api/v2/nft/%s/%s/owners?chain=%s&format=decimal&normalizeMetadata=false", address, tokenIdStr, POLYGON_CHAIN_STR)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Accept", "application/json")
	req.Header.Add("X-API-Key", API_KEY)

	// make http request
	res, err := http.DefaultClient.Do(req)
	errx.CheckError(err)
	defer res.Body.Close()
	var output *NftOwnerOutput

	// unmarshal data structure
	content, err := ioutil.ReadAll(res.Body)
	errx.CheckError(err)
	errx.CheckError(json.Unmarshal(content, output))

	// convert into string array
	result := linq.Map(output.Result, func(t *NftOwnerResult) string { return t.OwnerOf })
	return result
}
