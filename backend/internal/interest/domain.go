package interest

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"time"
)

type Interest struct {
	Address    string    `bson:"address" json:"address"`
	TargetId   string    `bson:"targetId" json:"targetId"`
	TargetType string    `bson:"targetType" json:"targetType"`
	CreatedAt  time.Time `bson:"createdAt"`
}

type Repository interface {
	ddd.RepositoryBase[Interest]

	DeleteBy(ctx context.Context, address, targetId, targetType string) int
	CheckMany(ctx context.Context, address []string, targetId, targetType string) []string
}
