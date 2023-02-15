package hackathon

type NftMetaData struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type NftMetaDataOutput struct {
	NormalizedMetadata NftMetaData `json:"normalized_metadata"`
}

type NftOwnerResult struct {
	OwnerOf string `json:"owner_of"`
}

type NftOwnerOutput struct {
	Result []NftOwnerResult `json:"result"`
}

type SbtInWallet struct {
	Address string `json:"token_address"`
	TokenId string `json:"token_id"`
	Uri     string `json:"token_uri"`
}

type NftByWalletOutput struct {
	Total  int           `json:"total"`
	Result []SbtInWallet `json:"result"`
}
