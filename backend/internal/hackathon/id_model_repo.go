package hackathon

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
)

type PlatformType int

const (
	BoothPlatform    = 0
	DeSchoolPlatform = 1
)

type Id struct {
	Platform    PlatformType `bson:"platform"`
	Address     string       `bson:"address"`
	BaseAddress string       `bson:"baseAddress"`
	LensHandle  string       `bson:"lensHandle"`
}

type IdRepository interface {
	ddd.RepositoryBase[Id]
	GetListByAddress(ctx context.Context, address string) []Id
	CheckExistsByAddrBaseAddrAndPltfm(ctx context.Context, address string, baseAddr string, platform PlatformType) bool
}
