package hackathon

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
)

type Resume struct {
	Data    string `bson:"data" json:"data"`
	Address string `bson:"address" json:"address"`
}

type ResumeRepository interface {
	ddd.RepositoryBase[Resume]
	FindOneByAddress(ctx context.Context, address string) *Resume
}
