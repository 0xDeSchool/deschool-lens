package hackathon

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
)

type PlatformType int

const (
	BoothPlatform        = 0
	DeSchoolPlatform     = 1
	LensPlatform         = 2
	CyberConnectPlatform = 3
)

type Id struct {
	Platform            PlatformType `bson:"platform" json:"platform"`
	Address             string       `bson:"address" json:"address"`
	BaseAddress         string       `bson:"baseAddress" json:"baseAddress"`
	LensHandle          string       `bson:"lensHandle" json:"lensHandle"`
	ddd.AuditEntityBase `bson:",inline"`
}

type IdRepository interface {
	ddd.Repository[Id]
	GetListByAddress(ctx context.Context, address string) []Id
	CheckExistsByAddrBaseAddrAndPltfm(ctx context.Context, address string, baseAddr string, platform PlatformType) bool
	GetListByBaseAddr(ctx context.Context, baseAddr string) []Id
	GetTen(ctx context.Context) []Id

	CheckAddrs(ctx context.Context, addrs []string) []string
}
