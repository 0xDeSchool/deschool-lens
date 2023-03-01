package identity

import "context"

type UserRepository interface {
	Insert(ctx context.Context, u *User)
	InsertMany(ctx context.Context, us []*User)
	LinkPlatform(ctx context.Context, p *UserPlatform)
	UnlinkPlatform(ctx context.Context, address string, handle string, platform string)

	Find(ctx context.Context, address string) *User
	GetMany(ctx context.Context, addresses []string) []*User
	GetPlatforms(ctx context.Context, address string) []*UserPlatform
}
