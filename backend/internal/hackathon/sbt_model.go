package hackathon

type SbtDetail struct {
	Metadata *NftMetaData
	Owners   []string
}

type IdSbtDetail struct {
	Abilities [6]int
	Sbts      []SbtInWallet
}
