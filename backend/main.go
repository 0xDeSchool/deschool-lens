package main

import (
	"github.com/0xdeschool/deschool-lens/backend/internal"
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
)

func main() {
	app, err := buildApp()
	errx.CheckError(err)
	app.Run()
}

func buildApp() (*app.App, error) {
	builder := app.NewAppBuilder()
	builder.Use(internal.LensHackathonServer)
	return builder.Build()
}
