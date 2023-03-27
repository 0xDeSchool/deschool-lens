package identity

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"github.com/0xdeschool/deschool-lens/backend/pkg/x"
	"github.com/ethereum/go-ethereum/common"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRepository interface {
	ddd.Repository[User]
	Insert(ctx context.Context, u *User) primitive.ObjectID
	Update(ctx context.Context, Id primitive.ObjectID, u *User) int
	InsertMany(ctx context.Context, us []User, ignoreErr bool) []primitive.ObjectID
	LinkPlatform(ctx context.Context, p *UserPlatform)
	UnlinkPlatform(ctx context.Context, userId primitive.ObjectID, address common.Address, handle string, platform UserPlatformType) int

	Find(ctx context.Context, address common.Address) *User
	GetManyByAddr(ctx context.Context, userIds []common.Address) []User
	GetPlatforms(ctx context.Context, userId primitive.ObjectID) []UserPlatform
	GetManyPlatforms(ctx context.Context, userIds []primitive.ObjectID) []UserPlatform

	GetUsers(ctx context.Context, q *string, platform *UserPlatformType, p *x.PageAndSort) []User
}
