package hackathon

type SbtDetail struct {
	Metadata *NftMetaDataOutput
	Owners   []string
}

type IdSbtDetail struct {
	Abilities [6]int        `json:"ability"`
	Sbts      []SbtInWallet `json:"sbts"`
}
