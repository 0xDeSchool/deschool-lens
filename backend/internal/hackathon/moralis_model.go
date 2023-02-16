package hackathon

type NftMetaData struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type NftMetaDataOutput struct {
	Address            string      `json:"token_address"`
	TokenId            string      `json:"token_id"`
	ContractType       string      `json:"contract_type"`
	NormalizedMetadata NftMetaData `json:"normalized_metadata"`
}

type NftOwnerResult struct {
	OwnerOf string `json:"owner_of"`
}

type NftOwnerOutput struct {
	Result []NftOwnerResult `json:"result"`
}

type NMetadata struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type SbtInWallet struct {
	Address  string    `json:"token_address"`
	TokenId  string    `json:"token_id"`
	Uri      string    `json:"token_uri"`
	Metadata NMetadata `json:"normalized_metadata"`
}

type NftByWalletOutput struct {
	Total  int           `json:"total"`
	Result []SbtInWallet `json:"result"`
}
