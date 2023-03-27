package mongo

import (
	"context"
	"strings"

	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/x"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoTransactionContext struct {
	ctx mongo.SessionContext
}

func NewMongoTransactionContext(ctx mongo.SessionContext) MongoTransactionContext {
	return MongoTransactionContext{
		ctx: ctx,
	}
}

type MongoRepositoryBase[TEntity any] struct {
	Options        *mongodb.MongoOptions
	CollectionName string
}

func NewMongoRepositoryBase[TEntiy any](collectionName string) *MongoRepositoryBase[TEntiy] {
	return &MongoRepositoryBase[TEntiy]{
		Options:        di.Get[mongodb.MongoOptions](),
		CollectionName: collectionName,
	}
}

func (mr *MongoRepositoryBase[TEntity]) GetCollection(ctx context.Context, name string) *mongo.Collection {
	var client *mongo.Client
	if sessionCtx, ok := ctx.(mongo.SessionContext); ok {
		client = sessionCtx.Client()
	} else {
		client = di.Get[mongo.Client]()
	}
	return client.Database(mr.Options.DbName).Collection(name)
}

func (mr *MongoRepositoryBase[TEntity]) Collection(ctx context.Context) *mongodb.Collection[TEntity] {
	c := mr.GetCollection(ctx, mr.CollectionName)
	return mongodb.NewCollection[TEntity](c)
}

func (mr *MongoRepositoryBase[TEntity]) GetAll(ctx context.Context) []TEntity {
	return mr.Collection(ctx).Find(ctx, bson.D{{}})
}

func (mr *MongoRepositoryBase[TEntity]) Get(ctx context.Context, id primitive.ObjectID) *TEntity {
	return mr.Collection(ctx).Get(ctx, id)
}

func (mr *MongoRepositoryBase[TEntity]) FirstOrDefault(ctx context.Context, id primitive.ObjectID) *TEntity {
	data := mr.Collection(ctx).Find(ctx, bson.D{{Key: "_id", Value: id}})
	if len(data) > 0 {
		return &data[0]
	}
	return nil
}

func (mr *MongoRepositoryBase[TEntity]) Set(ctx context.Context, id primitive.ObjectID, enitty *TEntity) int {
	return mr.Collection(ctx).UpdateByID(ctx, id, enitty)
}

func (mr *MongoRepositoryBase[TEntity]) GetMany(ctx context.Context, ids []primitive.ObjectID) []TEntity {
	return mr.Collection(ctx).GetMany(ctx, ids, nil)
}

// FindByRegex 通过string类型字段进行字符串匹配
func (mr *MongoRepositoryBase[TEntity]) FindByRegex(ctx context.Context, field, regex string, p *x.PageAndSort) []TEntity {
	filter := bson.D{
		{Key: field, Value: bson.D{
			{Key: "$regex", Value: regex},
		}},
	}
	sort := mr.ParseSort(p)
	opts := options.Find().SetSort(sort)
	data, _ := mr.Collection(ctx).GetList(ctx, filter, p.Page, p.PageSize, opts)
	return data
}

func (mr *MongoRepositoryBase[TEntity]) GetPagedList(ctx context.Context, p *x.PageAndSort) ([]TEntity, int64) {
	sort := mr.ParseSort(p)
	opts := options.Find().SetSort(sort)
	return mr.Collection(ctx).GetList(ctx, bson.D{}, p.Page, p.PageSize, opts)
}

func (mr *MongoRepositoryBase[TEntity]) ParseSort(p *x.PageAndSort) bson.D {
	sort := bson.D{}
	if p.Sort != "" {
		desc := 1
		k := ""
		if p.IsDesc() {
			desc = -1
			k = p.Sort[1:]
		} else {
			k = strings.TrimLeft(p.Sort, "+")
		}
		sort = append(sort, bson.E{Key: k, Value: desc})
	} else {
		if x.CanConvert[TEntity, ddd.AuditEntityBase]() {
			sort = append(sort, bson.E{Key: "createdAt", Value: -1})
		}
	}
	return sort
}

func (mr *MongoRepositoryBase[TEntity]) GetList(ctx context.Context, filter bson.D, page int64, pageSize int64, opt *options.FindOptions) ([]TEntity, int64) {
	return mr.Collection(ctx).GetList(ctx, filter, page, pageSize, opt)
}

func (mr *MongoRepositoryBase[TEntity]) Find(ctx context.Context, filter bson.D, opts ...*options.FindOptions) []TEntity {
	return mr.Collection(ctx).Find(ctx, filter, opts...)
}

func (mr *MongoRepositoryBase[TEntity]) FindOne(ctx context.Context, filter bson.D, opts ...*options.FindOneOptions) *TEntity {
	return mr.Collection(ctx).FindOne(ctx, filter, opts...)
}

func (mr *MongoRepositoryBase[TEntity]) Insert(ctx context.Context, entity *TEntity) primitive.ObjectID {
	return mr.Collection(ctx).Insert(ctx, entity)
}

func (mr *MongoRepositoryBase[TEntity]) InsertMany(ctx context.Context, entitis []TEntity, ignoreErr bool) []primitive.ObjectID {
	return mr.Collection(ctx).InsertMany(ctx, entitis, ignoreErr)
}

func (mr *MongoRepositoryBase[TEntity]) Exists(ctx context.Context, id primitive.ObjectID) bool {
	return mr.Collection(ctx).Exists(ctx, id)
}

func (mr *MongoRepositoryBase[TEntity]) ExistsByField(ctx context.Context, field string, v any) bool {
	return mr.Collection(ctx).ExistsByFilter(ctx, bson.D{{Key: field, Value: v}})
}

func (mr *MongoRepositoryBase[TEntity]) Update(ctx context.Context, id primitive.ObjectID, entity *TEntity) int {
	return mr.Collection(ctx).UpdateByID(ctx, id, entity)
}

func (mr *MongoRepositoryBase[TEntity]) Delete(ctx context.Context, id primitive.ObjectID) int {
	return mr.Collection(ctx).Delete(ctx, id)
}

func (mr *MongoRepositoryBase[TEntity]) DeleteMany(ctx context.Context, ids []primitive.ObjectID) int {
	return mr.Collection(ctx).DeleteMany(ctx, ids)
}

type orderResult struct {
	MaxOrder float64 `bson:"maxOrder"`
}

func (mr *MongoRepositoryBase[TEntiy]) MaxOrder(ctx context.Context, field string, v any) float64 {
	match := bson.D{{Key: "$match", Value: bson.D{{Key: field, Value: v}}}}
	var groupKey any = primitive.NilObjectID
	if field != "" {
		groupKey = "$" + field
	}
	groupMax := bson.D{{Key: "$group", Value: bson.D{
		{Key: "_id", Value: groupKey},
		{Key: "maxOrder", Value: bson.M{"$max": "$order"}},
	}}}
	aggregate := bson.A{}
	if field != "" {
		aggregate = append(aggregate, match)
	}
	aggregate = append(aggregate, groupMax)
	result, err := mr.Collection(ctx).Col().Aggregate(ctx, aggregate)
	errx.CheckError(err)
	results := make([]orderResult, 0)
	errx.CheckError(result.All(ctx, &results))
	if len(results) > 0 {
		return results[0].MaxOrder
	}
	return 0
}

func (mr *MongoRepositoryBase[TEntity]) MaxOrderMany(ctx context.Context, field string, v any) map[any]float64 {
	match := bson.D{{Key: "$match", Value: bson.D{{Key: field, Value: bson.M{"$in": v}}}}}
	var groupKey any = primitive.NilObjectID
	if field != "" {
		groupKey = "$" + field
	}
	groupMax := bson.D{{Key: "$group", Value: bson.D{
		{Key: "_id", Value: groupKey},
		{Key: "maxOrder", Value: bson.M{"$max": "$order"}},
	}}}
	aggregate := bson.A{}
	if field != "" {
		aggregate = append(aggregate, match)
	}
	aggregate = append(aggregate, groupMax)
	result, err := mr.Collection(ctx).Col().Aggregate(ctx, aggregate)
	errx.CheckError(err)
	var results []bson.M
	errx.CheckError(result.All(ctx, &results))
	data := make(map[any]float64)
	for k := range results {
		key := results[k]["_id"]
		if key != nil {
			if maxOrder, ok := results[k]["maxOrder"].(float64); ok {
				data[key] = maxOrder
			} else if mo, ok := results[k]["maxOrder"].(int32); ok {
				data[key] = float64(mo)
			}
		}
	}
	return data
}

// Count count
func (mr *MongoRepositoryBase[TEntity]) Count(ctx context.Context) int64 {
	return mr.FilterCount(ctx, bson.D{})
}

// FilterCount count
func (mr *MongoRepositoryBase[TEntity]) FilterCount(ctx context.Context, filter bson.D) int64 {
	return mr.Collection(ctx).Count(ctx, filter)
}

// Upsert By Field
func (mr *MongoRepositoryBase[TEntity]) UpsertByField(ctx context.Context, field string, fieldValue any, newObj *TEntity) primitive.ObjectID {
	filter := bson.D{
		{Key: field, Value: fieldValue},
	}
	setter := bson.D{
		{Key: "$set", Value: newObj},
	}
	ddd.SetAudited(ctx, newObj)
	options := options.Update().SetUpsert(true)
	result, err := mr.Collection(ctx).Col().UpdateOne(ctx, filter, setter, options)
	errx.CheckError(err)
	retId, ok := result.UpsertedID.(primitive.ObjectID)
	if ok {
		return retId
	}
	return primitive.NilObjectID
}
