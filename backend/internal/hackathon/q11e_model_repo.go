package hackathon

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
)

type MbtiType int

const (
	INFP MbtiType = 0
	ENFP MbtiType = 1
	INFJ MbtiType = 2
	ENFJ MbtiType = 3

	INTJ MbtiType = 4
	ENTJ MbtiType = 5
	INTP MbtiType = 6
	ENTP MbtiType = 7

	ISFP MbtiType = 8
	ESFP MbtiType = 9
	ISTP MbtiType = 10
	ESTP MbtiType = 11

	ISFJ MbtiType = 12
	ESFJ MbtiType = 13
	ISTJ MbtiType = 14
	ESTJ MbtiType = 15

	UnKnown MbtiType = -1
)

type Q11e struct {
	UserId    primitive.ObjectID `json:"userId"`
	Goals     []string           `json:"goals"`
	Interests []string           `json:"interests"`
	Pref1     string             `json:"pref1"`
	Pref2     string             `json:"pref2"`
	Pref3     string             `json:"pref3"`
	Mbti      int                `json:"mbti"`
}

type Q11eRepository interface {
	ddd.RepositoryBase[Q11e]
	GetByAddress(ctx context.Context, userId primitive.ObjectID) *Q11e
	CheckAndGetExistsByAddr(ctx context.Context, userId primitive.ObjectID) (bool, *Q11e)

	GetManyByAddress(ctx context.Context, userIds []primitive.ObjectID) []Q11e
}
