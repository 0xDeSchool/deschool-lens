package hackathon

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
)

func GetNftMetadata(address string, tokenId int) *NftMetaData {
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
	var output NftMetaDataOutput

	// unmarshal data structure
	content, err := ioutil.ReadAll(res.Body)
	errx.CheckError(err)
	errx.CheckError(json.Unmarshal(content, &output))

	return &output.NormalizedMetadata
}

func GetOwners(address string, tokenId int) []string {

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
	var output NftOwnerOutput

	// unmarshal data structure
	content, err := ioutil.ReadAll(res.Body)
	errx.CheckError(err)
	errx.CheckError(json.Unmarshal(content, &output))

	// convert into string array
	result := linq.Map(output.Result, func(t *NftOwnerResult) string { return t.OwnerOf })
	return result
}

func GetNftByWallet(address string) *NftByWalletOutput {

	// set up param
	// TODO: Move this to config.yaml
	const API_KEY = "JoHVGRL3Rxu3MPjBYdQGlQkEHnjnsKYBF5Ij3RWsaP7Kmz0ZlXZ1Ay7wfrO8tRfd"
	const TOKEN_ADDR_LIST_STR = "&token_addresses%5B0%5D=0xbac24a47c9f9d53500dfee0f4d996a009a5ba2d4&token_addresses%5B1%5D=0xEd1e617b9485168EEB25c6d56e1219747cE62D0e&token_addresses%5B2%5D=0x0D9ea891B4C30e17437D00151399990ED7965F00"

	// prepare http request
	url := fmt.Sprintf("https://deep-index.moralis.io/api/v2/%s/nft?chain=polygon&format=decimal&disable_total=false%s&normalizeMetadata=true", address, TOKEN_ADDR_LIST_STR)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Accept", "application/json")
	req.Header.Add("X-API-Key", API_KEY)

	// make http request
	res, err := http.DefaultClient.Do(req)
	errx.CheckError(err)
	defer res.Body.Close()
	var output NftByWalletOutput

	// unmarshal data structure
	content, err := ioutil.ReadAll(res.Body)
	errx.CheckError(err)
	errx.CheckError(json.Unmarshal(content, &output))

	// return
	return &output
}
