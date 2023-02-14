package hackathon

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
)

type PlatformType string

const (
	DeSchoolPlatform = "deschool"
	BoothPlatform    = "booth"
	LensPlatform     = "lens"
)

type Id struct {
	Platform PlatformType `bson:"platform"`
	Address  string       `bson:"address"`
}

type IdRepository interface {
	ddd.RepositoryBase[Id]
	GetListByAddress(ctx context.Context, address string) []Id
}
