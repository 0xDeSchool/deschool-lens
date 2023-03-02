package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/ethereum/go-ethereum/common"
	"go.mongodb.org/mongo-driver/bson"
)

type MongoUserRecommendRepository struct {
	*MongoRepositoryBase[hackathon.UserRecommendation]
}

func NewMongoUserRecommendRepository(c *di.Container) *hackathon.UserRecommendationRepository {
	var repo hackathon.UserRecommendationRepository = &MongoUserRecommendRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[hackathon.UserRecommendation]("matched_records"),
	}
	return &repo
}

func (r *MongoUserRecommendRepository) GetUsers(ctx context.Context, addr string) []string {
	filter := bson.D{
		{Key: "fromAddr", Value: common.HexToAddress(addr).Hex()},
	}
	data := r.Find(ctx, filter)
	return linq.Map(data, func(x *hackathon.UserRecommendation) string {
		return x.ToAddr
	})
}
