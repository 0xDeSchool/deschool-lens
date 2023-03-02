package identity

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRepository interface {
	Insert(ctx context.Context, u *User) primitive.ObjectID
	InsertMany(ctx context.Context, us []User, ignoreErr bool) []primitive.ObjectID
	LinkPlatform(ctx context.Context, p *UserPlatform)
	UnlinkPlatform(ctx context.Context, address string, handle string, platform string)

	Find(ctx context.Context, address string) *User
	GetMany(ctx context.Context, addresses []string) []User
	GetPlatforms(ctx context.Context, address string) []UserPlatform
}
