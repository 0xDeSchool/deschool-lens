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
	Metadata *hackathon.NftMetaDataOutput
	Owners   []string
}

type PutQ11eInput struct {
	Address   string   `json:"address"`
	Goals     []string `json:"goals"`
	Interests []string `json:"interests"`
	Pref1     string   `json:"pref1"`
	Pref2     string   `json:"pref2"`
	Pref3     string   `json:"pref3"`
	Mbti      int      `json:"mbti"`
}

func NewQ11e(input *PutQ11eInput) *hackathon.Q11e {
	q := &hackathon.Q11e{
		Address:   input.Address,
		Goals:     input.Goals,
		Interests: input.Interests,
		Pref1:     input.Pref1,
		Pref2:     input.Pref2,
		Pref3:     input.Pref3,
		Mbti:      input.Mbti,
	}
	return q
}
