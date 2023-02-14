package hackathon

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
)

type Resume struct {
	Data    string `bson:"data"`
	Address string `bson:"address"`
}

type ResumeRepository interface {
	ddd.RepositoryBase[Resume]
	FindOneByAddress(ctx context.Context, address string) *Resume
}
