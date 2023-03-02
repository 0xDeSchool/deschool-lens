package hackathon

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"time"
)

type UserRecommendation struct {
	FromAddr string    `bson:"fromAddr"`
	ToAddr   string    `bson:"toAddr"`
	Reasons  []string  `bson:"reasons"`
	Used     time.Time `bson:"used"`
	Score    int       `bson:"score"`
}

type UserRecommendationRepository interface {
	ddd.RepositoryBase[UserRecommendation]

	GetUsers(ctx context.Context, addr string) []string
}
