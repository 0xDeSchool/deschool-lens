package hackathon

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
)

type HackathonManager struct {
}

func NewHackathonManager(c *di.Container) *HackathonManager {
	hm := &HackathonManager{}
	return hm
}

func (hm *HackathonManager) SayHello(ctx context.Context) string {
	return "Hello World"
}
