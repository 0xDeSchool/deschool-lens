package server

import (
	"strconv"

	"github.com/0xdeschool/deschool-lens/backend/pkg/log"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
)

type ServerConfigureFunc func(s *Server) error

type ServerOptions struct {
	Port     int
	RootUrl  string
	LogLevel zerolog.Level
}

type Server struct {
	G       *gin.Engine
	Options *ServerOptions
}

func NewServer(g *gin.Engine, options *ServerOptions) *Server {
	return &Server{
		G:       g,
		Options: options,
	}
}

func (s Server) Run() error {
	addr := ":" + strconv.Itoa(s.Options.Port)
	if s.Options.Port == 0 {
		addr = ":5000"
	}
	log.Info("********** Listening: " + addr + " ***********\n")
	return s.G.Run(addr)
}
