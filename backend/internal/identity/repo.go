package identity

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRepository interface {
	Insert(ctx context.Context, u *User) primitive.ObjectID
	Update(ctx context.Context, Id primitive.ObjectID, u *User) int
	InsertMany(ctx context.Context, us []User, ignoreErr bool) []primitive.ObjectID
	LinkPlatform(ctx context.Context, p *UserPlatform)
	UnlinkPlatform(ctx context.Context, address common.Address, handle string, platform string)

	Find(ctx context.Context, address common.Address) *User
	GetManyByAddr(ctx context.Context, addresses []common.Address) []User
	GetPlatforms(ctx context.Context, address common.Address) []UserPlatform
}
