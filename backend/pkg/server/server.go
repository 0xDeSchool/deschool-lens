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
	g *gin.Engine

	Options *ServerOptions
	Route   gin.IRouter
}

func NewServer(g *gin.Engine, options *ServerOptions) *Server {
	return &Server{
		g:       g,
		Options: options,
		Route:   g,
	}
}

func (s Server) Run() error {
	addr := ":" + strconv.Itoa(s.Options.Port)
	if s.Options.Port == 0 {
		addr = ":8000"
	}
	log.Info("********** Lens Hackathon Micro-service Starting ***********\n")
	log.Info("Listening port: " + addr)

	return s.g.Run(addr)
}
