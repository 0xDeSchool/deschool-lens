package identity

type LinkPlatformInput struct {
	Address    string     `json:"address"`
	Handle     string     `json:"handle"`     // 对应平台的用户标识
	Platform   string     `json:"platform"`   // 平台唯一标识，如 lens, cc(CyberConnect), deschool
	WalletType WalletType `json:"walletType"` // 当前签名的钱包类型
	signHex    string     `json:"signHex"`    // 签名
}
