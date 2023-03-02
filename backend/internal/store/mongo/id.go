package mongo

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const IdCollectionName = "id"

type MongoIdRepository struct {
	*MongoRepositoryBase[hackathon.Id]
}

func NewMongoIdRepository(c *di.Container) *hackathon.IdRepository {
	var repo hackathon.IdRepository = &MongoIdRepository{
		MongoRepositoryBase: NewMongoRepositoryBase[hackathon.Id](IdCollectionName),
	}
	return &repo
}

func (r *MongoIdRepository) GetListByAddress(ctx context.Context, address string) []hackathon.Id {
	filter := bson.D{
		{Key: "address", Value: address},
	}
	return r.Find(ctx, filter)
}

func (r *MongoIdRepository) CheckExistsByAddrBaseAddrAndPltfm(ctx context.Context, address string, baseAddr string, platform hackathon.PlatformType) bool {
	// 查询条件
	filter := bson.D{{
		Key:   "address",
		Value: address,
	}, {
		Key:   "baseAddress",
		Value: baseAddr,
	}, {
		Key:   "platform",
		Value: platform,
	}}
	var result hackathon.Id
	err := r.Collection(ctx).Col().FindOne(ctx, filter).Decode(&result)

	// 不存在
	if err == mongo.ErrNoDocuments {
		return false
	} else {
		errx.CheckError(err)
	}

	return true
}

func (r *MongoIdRepository) GetListByBaseAddr(ctx context.Context, baseAddr string) []hackathon.Id {
	// 查询条件
	filter := bson.D{{
		Key:   "baseAddress",
		Value: baseAddr,
	}}
	return r.Find(ctx, filter)
}

func (r *MongoIdRepository) GetTen(ctx context.Context) []hackathon.Id {
	// 查询条件
	filter := bson.D{{}}
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}).SetLimit(25)
	return r.Find(ctx, filter, opts)
}

func (r *MongoIdRepository) CheckAddrs(ctx context.Context, addrs []string) []string {
	// 查询条件
	filter := bson.D{{
		Key:   "address",
		Value: bson.D{{Key: "$in", Value: addrs}},
	}}
	opts := options.Find().SetProjection(bson.D{{Key: "address", Value: 1}})
	ids := r.Find(ctx, filter, opts)
	return linq.Map(ids, func(i *hackathon.Id) string { return i.Address })
}
