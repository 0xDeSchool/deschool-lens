package pkg

import "github.com/0xdeschool/deschool-lens/backend/pkg/app"

func PkgModule(b *app.AppBuilder) {
	b.Use(AddHttpClient)
	b.Use(AddEthClient)
}
