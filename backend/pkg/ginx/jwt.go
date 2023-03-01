package ginx

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	jwt4 "github.com/golang-jwt/jwt/v4"
)

type JwtClaims map[string]interface{}

func UserClaims(c context.Context) JwtClaims {
	claims := c.Value("JWT_PAYLOAD")
	if claims == nil {
		return make(JwtClaims)
	}
	return JwtClaims(claims.(jwt.MapClaims))
}

func (m JwtClaims) FindAll(key string) []interface{} {
	result := make([]any, 0)
	for k := range m {
		if k == key {
			result = append(result, m[k])
		}
	}
	return result
}

func (m JwtClaims) Find(key string) interface{} {
	for k := range m {
		if k == key {
			return m[k]
		}
	}
	return nil
}

var ErrLoginFailed = errors.New("login failed")

const (
	ClaimRole     = "role"
	ClaimOrg      = "org"
	ClaimUserId   = "id"
	ClaimUserAddr = "addr"
)

// AddJwt 添加jwt
func AddJwt(builder *server.ServerBuiler, routePrefix string, configure func(*jwt.GinJWTMiddleware)) {
	authMidd := AuthHandlerFunc(builder)
	if authMidd != nil {
		return
	}
	jwtMid, err := NewJwtMiddleware(configure)
	errx.CheckError(err)
	builder.Items["JwtAuthMiddleware"] = jwtMid
	builder.PreConfigure(func(s *server.Server) error {
		// 登录接口，验证签名
		s.Route.POST(routePrefix+"/login", jwtMid.LoginHandler)
		// 登出接口
		s.Route.POST(routePrefix+"/logout", jwtMid.LogoutHandler)
		// 其他认证接口
		s.Route.POST(routePrefix+"/refresh_token", jwtMid.RefreshHandler)
		return nil
	})
	builder.App.ConfigureServices(func() error {
		di.AddValue(jwtMid)
		return nil
	})
}

// AuthHandlerFunc 获取认证中间件handler
func AuthHandlerFunc(buidler *server.ServerBuiler) gin.HandlerFunc {
	m, ok := buidler.Items["JwtAuthMiddleware"]
	if !ok {
		return nil
	}
	if jwdMd, ok := m.(*jwt.GinJWTMiddleware); ok {
		return jwdMd.MiddlewareFunc()
	}
	panic("JwtAuthMiddleware type error")
	// return func(ctx *gin.Context) {}
}

// OptionalAuthHandlerFunc 支持匿名和用户登录两种访问方式
func OptionalAuthHandlerFunc(buidler *server.ServerBuiler) gin.HandlerFunc {
	m, ok := buidler.Items["JwtAuthMiddleware"]
	if !ok {
		return nil
	}
	if jwdMd, ok := m.(*jwt.GinJWTMiddleware); ok {
		return allowHandlerFunc(jwdMd)
	}
	panic("JwtAuthMiddleware type error")
	// return func(ctx *gin.Context) {}
}

func NewJwtMiddleware(configure func(*jwt.GinJWTMiddleware)) (*jwt.GinJWTMiddleware, error) {
	jwtMiddleware := &jwt.GinJWTMiddleware{
		Timeout:        time.Hour * 24 * 3,
		MaxRefresh:     time.Hour * 24 * 7,
		SendCookie:     false,
		CookieSameSite: http.SameSiteDefaultMode,

		Unauthorized: func(c *gin.Context, code int, message string) {
			panic(&HttpError{
				Message:    message,
				Code:       ErrCodeUnauthorized,
				HttpStatus: code,
			})
		},
		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		// - "param:<name>"
		TokenLookup: "header: Authorization, query: token, cookie: jwt",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",

		// TokenHeadName is a string in the header. Default value is "Bearer"
		TokenHeadName: "Bearer",

		// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.
		TimeFunc: time.Now,
	}
	if configure != nil {
		configure(jwtMiddleware)
	}
	return jwt.New(jwtMiddleware)
}

func allowHandlerFunc(mw *jwt.GinJWTMiddleware) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := mw.ParseToken(c)
		if ve, ok := err.(*jwt4.ValidationError); ok {
			if ve.Is(jwt4.ErrTokenExpired) {
				c.Next()
			}
		} else if errors.Is(err, jwt.ErrEmptyParamToken) ||
			errors.Is(err, jwt.ErrEmptyAuthHeader) ||
			errors.Is(err, jwt.ErrEmptyCookieToken) ||
			errors.Is(err, jwt.ErrExpiredToken) ||
			errors.Is(err, jwt.ErrEmptyQueryToken) {
			c.Next()
		} else {
			mw.MiddlewareFunc()(c)
		}
	}
}
