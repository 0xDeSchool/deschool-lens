package http

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
)

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
	UserId    string   `json:"userId"`
	Goals     []string `json:"goals"`
	Interests []string `json:"interests"`
	Pref1     string   `json:"pref1"`
	Pref2     string   `json:"pref2"`
	Pref3     string   `json:"pref3"`
	Mbti      int      `json:"mbti"`
}

func NewQ11e(input *PutQ11eInput) *hackathon.Q11e {
	q := &hackathon.Q11e{
		UserId:    mongodb.IDFromHex(input.UserId),
		Goals:     input.Goals,
		Interests: input.Interests,
		Pref1:     input.Pref1,
		Pref2:     input.Pref2,
		Pref3:     input.Pref3,
		Mbti:      input.Mbti,
	}
	return q
}

type UserItem struct {
	identity.UserInfo `json:",inline"`
	FollowingCount    int  `json:"followingCount"`
	FollowerCount     int  `json:"followerCount"`
	IsFollowing       bool `json:"isFollowing"`
}

func NewUserItem(u *identity.User) *UserItem {
	return &UserItem{
		UserInfo: *identity.NewUserInfo(u, false),
	}
}
