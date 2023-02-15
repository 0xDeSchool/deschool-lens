package http

import "github.com/0xdeschool/deschool-lens/backend/internal/hackathon"

type IdValidateInput struct {
	Sig      string `json:"sig"`
	Address  string `json:"address"`
	Platform string `json:"platform"`
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
