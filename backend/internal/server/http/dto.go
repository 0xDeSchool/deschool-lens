package http

import "github.com/0xdeschool/deschool-lens/backend/internal/hackathon"

type IdValidateInput struct {
	Address     string `json:"address"`
	BaseAddress string `json:"baseAddress"`
	LensHandle  string `json:"lensHandle"`
	Platform    int    `json:"platform"`
}

type IdValidateOutput struct {
	Success bool `json:"success"`
}

type ResumePutInput struct {
	Address string `json:"address"`
	Data    string `json:"data"`
}

type GetSbtDetailInput struct {
	Address string `json:"address"`
	TokenId int    `json:"tokenId"`
}

type GetSbtDetailOutput struct {
	Metadata *hackathon.NftMetaData
	Owners   []string
}

type PutQ11eInput struct {
	Address string   `json:"address"`
	Goals   []string `json:"goals"`
	Fields  []string `json:"fields"`
	Belief  []string `json:"belief"`
	Mbti    int      `json:"mbti"`
}
