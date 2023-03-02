package interest

type CreateInput struct {
	Address    string `json:"address" binding:"required"`
	TargetId   string `json:"targetId" binding:"required"`
	TargetType string `json:"targetType" binding:"required"`
}

func (c *CreateInput) ToEntity() *Interest {
	return &Interest{
		Address:    c.Address,
		TargetId:   c.TargetId,
		TargetType: c.TargetType,
	}
}
