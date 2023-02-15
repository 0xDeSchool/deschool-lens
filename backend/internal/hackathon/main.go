package hackathon

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
)

type HackathonManager struct {
	idRepo     IdRepository
	resumeRepo ResumeRepository
	q11eRepo   Q11eRepository
}

func NewHackathonManager(c *di.Container) *HackathonManager {

	idRepo := *di.Get[IdRepository]()
	resumeRepo := *di.Get[ResumeRepository]()
	q11eRepo := *di.Get[Q11eRepository]()

	hm := &HackathonManager{
		idRepo:     idRepo,
		resumeRepo: resumeRepo,
		q11eRepo:   q11eRepo,
	}
	return hm
}
