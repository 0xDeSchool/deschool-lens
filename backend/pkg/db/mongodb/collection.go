package mongodb

import (
	"context"
	"errors"

	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Collection[TEntity any] struct {
	c *mongo.Collection
}

func NewCollection[TEntity any](c *mongo.Collection) *Collection[TEntity] {
	return &Collection[TEntity]{
		c: c,
	}
}

func (c *Collection[TEntity]) Find(ctx context.Context, filter bson.D, opts ...*options.FindOptions) []TEntity {
	filter = c.setSoftDeleteFilter(filter)
	cur, err := c.Col().Find(ctx, filter, opts...)
	errx.CheckError(err)
	data := make([]TEntity, 0)
	errx.CheckError(cur.All(context.Background(), &data))
	return data
}

func (c *Collection[TEntity]) FindOne(ctx context.Context, filter bson.D, opts ...*options.FindOneOptions) *TEntity {
	filter = c.setSoftDeleteFilter(filter)
	result := c.Col().FindOne(ctx, filter, opts...)
	if errors.Is(result.Err(), mongo.ErrNoDocuments) {
		return nil
	} else {
		errx.CheckError(result.Err())
	}
	var v TEntity
	err := result.Decode(&v)
	errx.CheckError(err)
	return &v
}

func (r *Collection[TEntity]) Get(ctx context.Context, id primitive.ObjectID) *TEntity {
	errx.NotNil(id, "id")
	filter := bson.D{{Key: "_id", Value: id}}
	return r.FindOne(ctx, filter)
}

func (c *Collection[TEntity]) Count(ctx context.Context, filter bson.D, opts ...*options.CountOptions) int64 {
	filter = c.setSoftDeleteFilter(filter)
	totalCount, err := c.Col().CountDocuments(ctx, filter, opts...)
	errx.CheckError(err)
	return totalCount
}

func (r *Collection[TEntity]) GetMany(ctx context.Context, ids []primitive.ObjectID, filter bson.D) []TEntity {
	errx.NotNil(ids, "ids")
	if len(ids) == 0 {
		return make([]TEntity, 0)
	}
	f := bson.D{{Key: "_id", Value: bson.D{{Key: "$in", Value: ids}}}}
	if len(filter) > 0 {
		f = append(f, filter...)
	}
	f = r.setSoftDeleteFilter(f)
	result, err := r.Col().Find(ctx, f)
	errx.CheckError(err)
	data := make([]TEntity, 0)
	err = result.All(context.Background(), &data)
	errx.CheckError(err)
	return data
}

func (r *Collection[TEntity]) GetList(ctx context.Context, filter bson.D, page int64, pageSize int64, opt *options.FindOptions) ([]TEntity, int64) {
	totalCount := r.Count(ctx, filter)
	findOptions := options.Find().SetLimit(pageSize).SetSkip((page - 1) * pageSize)
	data := r.Find(ctx, filter, findOptions, opt)
	return data, totalCount
}

func (r *Collection[TEntity]) Exists(ctx context.Context, id primitive.ObjectID) bool {
	errx.NotNil(id, "id")
	filter := r.setSoftDeleteFilter(bson.D{{Key: "_id", Value: id}})
	var result TEntity
	err := r.Col().FindOne(ctx, filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false
		}
		panic(err)
	}
	return true
}

func (r *Collection[TEntity]) Insert(ctx context.Context, entity *TEntity) primitive.ObjectID {
	ddd.SetAudited(ctx, entity)
	result, err := r.Col().InsertOne(ctx, entity)
	errx.CheckError(err)
	return result.InsertedID.(primitive.ObjectID)
}

func (r *Collection[TEntity]) InsertMany(ctx context.Context, entitis []TEntity, ignoreErr bool) []primitive.ObjectID {
	data := ddd.SetAuditedMany(ctx, entitis)
	opts := options.InsertMany().SetOrdered(!ignoreErr)
	result, err := r.Col().InsertMany(ctx, data, opts)
	if !ignoreErr {
		errx.CheckError(err)
	}
	return linq.Map(result.InsertedIDs, func(t *interface{}) primitive.ObjectID { return (*t).(primitive.ObjectID) })
}

func (r *Collection[TEntity]) UpdateByID(ctx context.Context, id primitive.ObjectID, entity *TEntity) int {
	ddd.SetAudited(ctx, entity)
	result, err := r.Col().UpdateByID(ctx, id, bson.D{{Key: "$set", Value: entity}})
	errx.CheckError(err)
	return int(result.ModifiedCount)
}

func (r *Collection[TEntity]) UpdateOne(ctx context.Context, filter bson.D, entity *TEntity, opts ...*options.UpdateOptions) int {
	filter = r.setSoftDeleteFilter(filter)
	ddd.SetAudited(ctx, entity)
	result, err := r.Col().UpdateOne(ctx, filter, bson.D{{Key: "$set", Value: entity}}, opts...)
	errx.CheckError(err)
	return int(result.ModifiedCount)
}

func (r *Collection[TEntity]) Delete(ctx context.Context, id primitive.ObjectID) int {
	var v any = (*TEntity)(nil)
	if _, ok := v.(ddd.SoftDeleteEntity); ok {
		e := r.Get(ctx, id)
		var v any = e
		softEntity := v.(ddd.DeletionAuditedEntity)
		softEntity.Deleting(ctx)
		return int(r.UpdateByID(ctx, id, e))
	} else {
		result, err := r.Col().DeleteOne(ctx, bson.D{{Key: "_id", Value: id}})
		errx.CheckError(err)
		return int(result.DeletedCount)
	}
}

func (r *Collection[TEntity]) DeleteMany(ctx context.Context, ids []primitive.ObjectID) int {
	var v any = (*TEntity)(nil)
	if _, ok := v.(ddd.DeletionAuditedEntity); ok {
		ctx := ginx.WithScopedUnitwork(ctx)
		var count int = 0
		for i := range ids {
			e := r.Get(ctx, ids[i])
			var v any = e
			softEntity := v.(ddd.DeletionAuditedEntity)
			softEntity.Deleting(ctx)
			count += r.UpdateByID(ctx, ids[i], e)
		}
		return int(count)
	} else {
		result, err := r.Col().DeleteMany(ctx, bson.D{{Key: "_id", Value: bson.M{"$in": ids}}})
		errx.CheckError(err)
		return int(result.DeletedCount)
	}
}

func (c *Collection[TEntity]) setSoftDeleteFilter(filter bson.D) bson.D {
	var v any = (*TEntity)(nil)
	if _, ok := v.(ddd.SoftDeleteEntity); ok {
		return append(filter, bson.E{Key: ddd.SoftDeleteFieldName, Value: false})
	}
	return filter
}

func (c *Collection[TEntity]) Col() *mongo.Collection {
	return c.c
}
