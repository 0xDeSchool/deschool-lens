package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/interest"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/ethereum/go-ethereum/common"
	"go.mongodb.org/mongo-driver/bson"
)

const InterestsCollectionName = "interests"

type MongoInterestRepository struct {
	*MongoRepositoryBase[interest.Interest]
}

func NewMongoInterestRepository(c *di.Container) *interest.Repository {
	var repo interest.Repository = &MongoInterestRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[interest.Interest](InterestsCollectionName),
	}
	return &repo
}

func (r *MongoInterestRepository) DeleteBy(ctx context.Context, address, targetId, targetType string) int {
	filter := bson.D{
		{"address", common.HexToAddress(address).Hex()},
		{"targetId", targetId},
		{"targetType", targetType},
	}
	result, err := r.Collection(ctx).Col().DeleteMany(ctx, filter)
	errx.CheckError(err)
	return int(result.DeletedCount)
}
func (r *MongoInterestRepository) GetManyByAddr(ctx context.Context, addresses []string, targetType string) []interest.Interest {
	filter := bson.D{
		{"address", bson.D{{"$in", toAddress(addresses)}}},
		{"targetType", targetType},
	}
	return r.Find(ctx, filter)
}

func (r *MongoInterestRepository) CheckMany(ctx context.Context, address []string, targetId []string, targetType string) []interest.Interest {
	filter := bson.D{
		{"address", bson.D{{"$in", toAddress(address)}}},
		{"targetId", bson.D{{"$in", targetId}}},
		{"targetType", targetType},
	}
	return r.Find(ctx, filter)
}

func toAddress(addresses []string) []string {
	return linq.Map(addresses, func(x *string) string { return common.HexToAddress(*x).Hex() })
}
