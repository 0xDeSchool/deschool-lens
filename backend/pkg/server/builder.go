package server

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/app"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
)

type ServerBuiler struct {
	App     *app.AppBuilder
	preRuns []ServerConfigureFunc
	initors []ServerConfigureFunc
	Options *ServerOptions
	// 只在程序启动过程中进行操作，以保证协程安全
	Items map[string]any
}

func NewServerBuilder(builder *app.AppBuilder) *ServerBuiler {
	return &ServerBuiler{
		App:     builder,
		preRuns: make([]ServerConfigureFunc, 0),
		initors: make([]ServerConfigureFunc, 0),
		Options: &ServerOptions{
			LogLevel: zerolog.InfoLevel,
		},
		Items: make(map[string]any),
	}
}

// 配置服务，该方法参数在App.Run中、gin.Run之前运行
func (b *ServerBuiler) PreConfigure(action ServerConfigureFunc) *ServerBuiler {
	b.preRuns = append(b.preRuns, action)
	return b
}

// 配置服务，该方法参数在App.Run中、gin.Run之前运行
func (b *ServerBuiler) Configure(action ServerConfigureFunc) *ServerBuiler {
	b.initors = append(b.initors, action)
	return b
}

func (b *ServerBuiler) Add(module func(*ServerBuiler)) *ServerBuiler {
	module(b)
	return b
}

func (b *ServerBuiler) Build() (*Server, error) {
	g := gin.Default()
	server := NewServer(g, b.Options)
	for _, action := range b.preRuns {
		err := action(server)
		if err != nil {
			return nil, err
		}
	}
	for _, action := range b.initors {
		err := action(server)
		if err != nil {
			return nil, err
		}
	}
	return server, nil
}
