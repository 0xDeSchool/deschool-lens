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
	ddd.EntityBase `bson:",inline"`
	UserId         primitive.ObjectID `bson:"userId"`
	Goals          []string           `bson:"goals"`
	Interests      []string           `bson:"interests"`
	Pref1          string             `bson:"pref1"`
	Pref2          string             `bson:"pref2"`
	Pref3          string             `bson:"pref3"`
	Mbti           int                `bson:"mbti"`

	Address string `json:"address"`
}

type Q11eRepository interface {
	ddd.RepositoryBase[Q11e]
	GetByUserId(ctx context.Context, userId primitive.ObjectID) *Q11e
	CheckAndGetExistsByUser(ctx context.Context, userId primitive.ObjectID) (bool, *Q11e)

	GetManyByUsers(ctx context.Context, userIds []primitive.ObjectID) []Q11e
}
