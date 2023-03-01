package auth

type SignMessageInput struct {
	Address string `json:"address" binding:"required"`
}

type SingMessageOutput struct {
	Message string `json:"message"`
}

type VerifySignMessageInput struct {
	Address string `json:"address" binding:"required"`
	Sign    string `json:"sign" binding:"required"`
}
