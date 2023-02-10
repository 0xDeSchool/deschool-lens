package ddd

import (
	"context"
	"errors"

	"github.com/0xdeschool/deschool-lens/backend/pkg/x"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RepositoryBase[TEntity any] interface {
	GetAll(ctx context.Context) []TEntity
	Get(ctx context.Context, id primitive.ObjectID) *TEntity
	FirstOrDefault(ctx context.Context, id primitive.ObjectID) *TEntity
	GetPagedList(ctx context.Context, p *x.PageAndSort) ([]TEntity, int64)

	Set(ctx context.Context, id primitive.ObjectID, data *TEntity) int
	GetMany(ctx context.Context, ids []primitive.ObjectID) []TEntity
	Insert(ctx context.Context, entity *TEntity) primitive.ObjectID
	// ignoreErr: 是否忽略批量插入时的错误, 一般为false, 当导入时忽略重复key的时候可以设为true
	InsertMany(ctx context.Context, entitis []TEntity, ignoreErr bool) []primitive.ObjectID
	Exists(ctx context.Context, id primitive.ObjectID) bool
	Update(ctx context.Context, id primitive.ObjectID, entity *TEntity) int
	Delete(ctx context.Context, id primitive.ObjectID) int
	DeleteMany(ctx context.Context, ids []primitive.ObjectID) int

	Count(ctx context.Context) int64

	FindByRegex(ctx context.Context, field, regex string, p *x.PageAndSort) []TEntity
}

var (
	ErrEntityNotFound = errors.New("entity not found")
)
