package auth

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils"
	jwt "github.com/appleboy/gin-jwt/v2"
)

type LoginInput struct {
	Address    string                      `json:"address" binding:"required"`
	Sig        string                      `json:"sig" binding:"required"`
	WalletType identity.WalletType         `json:"walletType"`
	Platform   *identity.LinkPlatformInput `json:"platform"`
}

type JWTOptions struct {
	Key   string
	Realm string
}

// AddAuth 添加权限
func AddAuth(builder *server.ServerBuiler) {
	opts := &JWTOptions{
		Key:   "BoothJTWTokenKey",
		Realm: "Booth",
	}
	utils.ViperBind("JWT", opts)
	di.TryAddValue(opts)
	ginx.AddJwt(builder, "/api", func(mid *jwt.GinJWTMiddleware) {
		mid.Key = []byte(opts.Key)
		mid.Realm = opts.Realm
		mid.IdentityKey = identityKey
		mid.PayloadFunc = payloadFunc
		mid.IdentityHandler = identityHandler
		mid.Authenticator = jwtAuthenticate
		mid.Authorizator = jwtAuthorize
		mid.LoginResponse = jwtLoginResponse
		mid.LogoutResponse = jwtLogoutResponse
	})
	configureRoutes(builder)
}

func configureRoutes(builder *server.ServerBuiler) {
	auth := ginx.OptionalAuthHandlerFunc(builder)
	builder.Configure(func(s *server.Server) error {
		// 获取nonce进行签名
		s.Route.POST("/api/sign-msg", auth, getSignMsg)
		return nil
	})
}
