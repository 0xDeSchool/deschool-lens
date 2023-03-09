package interest

import "github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"

type CreateInput struct {
	UserId     string `json:"userId" binding:"required"`
	TargetId   string `json:"targetId" binding:"required"`
	TargetType string `json:"targetType" binding:"required"`
}

func (c *CreateInput) ToEntity() *Interest {
	return &Interest{
		UserId:     mongodb.IDFromHex(c.UserId),
		TargetId:   c.TargetId,
		TargetType: c.TargetType,
	}
}
