package auth

import "github.com/0xdeschool/deschool-lens/backend/internal/identity"

type SignMessageInput struct {
	Address  string            `json:"address" binding:"required"`
	SignType identity.SignType `json:"signType" binding:"required"`
}

type SingMessageOutput struct {
	Message string `json:"message"`
}

type VerifySignMessageInput struct {
	Address string `json:"address" binding:"required"`
	Sign    string `json:"sign" binding:"required"`
}
