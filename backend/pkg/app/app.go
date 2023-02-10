package app

import (
	"os"

	"github.com/0xdeschool/deschool-lens/backend/pkg/log"

	"github.com/spf13/cobra"
)

type App struct {
	rootCmd *cobra.Command
}

func newApp(root *cobra.Command) App {
	return App{
		rootCmd: root,
	}
}

func (app App) Run() {
	if err := app.rootCmd.Execute(); err != nil {
		log.Fatal(err, "程序出错: "+err.Error())
		os.Exit(1)
	}
}
