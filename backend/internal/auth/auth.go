package auth

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/ethereum/go-ethereum/common"
	"net/http"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var identityKey = "id"
var addressKey = "address"
var nameKey = "userName"

type LoginResult struct {
	Code     int    `json:"code"`
	JwtToken string `json:"jwtToken"`
	Expire   string `json:"expire"`
	UserName string `json:"username"`
	Avatar   string `json:"avatar"`
	Address  string `json:"address"`
}

type LogoutResult struct {
	Code    int  `json:"code"`
	Success bool `json:"success"`
}

func NewCurrentUserInfo(user *identity.User) *ginx.CurrentUserInfo {
	return &ginx.CurrentUserInfo{
		ID:       user.ID,
		UserName: user.UserName,
		Address:  user.Address,
		Avatar:   user.Avatar,
	}
}

func payloadFunc(data interface{}) jwt.MapClaims {
	if v, ok := data.(*ginx.CurrentUserInfo); ok {
		return jwt.MapClaims{
			identityKey: v.ID.Hex(),
			addressKey:  v.Address,
			nameKey:     v.UserName,
		}
	}
	return jwt.MapClaims{}
}

func identityHandler(c *gin.Context) interface{} {
	claims := jwt.ExtractClaims(c)
	id, ok := claims[identityKey]
	if !ok {
		return nil
	}
	idStr, ok := id.(string)
	if !ok {
		return nil
	}
	objId, err := primitive.ObjectIDFromHex(idStr)
	errx.CheckError(err)
	user := &ginx.CurrentUserInfo{
		ID: objId,
	}
	if addr, ok := claims[addressKey]; ok {
		user.Address = addr.(string)
	}
	if name, ok := claims[nameKey]; ok {
		user.UserName = name.(string)
	}
	c.Set("Login.User", user)
	return user
}

// @Summary      登录接口，验证签名
// @Tags         User
// @Accept       json
// @Produce      json
// @Param        course   body     auth.LoginInput   true  "登录信息"
// @Success      200  {object}  auth.LoginResult
// @Router      /api/login [post]
func jwtAuthenticate(c *gin.Context) (interface{}, error) {
	var input LoginInput
	err := c.BindJSON(&input)
	if err != nil {
		return nil, err
	}
	if input.WalletType == "" {
		input.WalletType = identity.MetaMask
	}
	if !common.IsHexAddress(input.Address) {
		ginx.PanicValidatition("invalid address")
	}
	addr := common.HexToAddress(input.Address)
	user, err := authenticate(c, addr, input.Sig, input.WalletType)
	if err != nil {
		return nil, err
	}
	c.Set("Login.User", user)
	return user, nil
}

func jwtAuthorize(data interface{}, c *gin.Context) bool {
	if v, ok := data.(*ginx.CurrentUserInfo); ok {
		return authorize(v, c)
	}
	return false
}

func jwtLoginResponse(c *gin.Context, code int, token string, expire time.Time) {
	v, ok := c.Get("Login.User")
	if !ok {
		ginx.PanicUnAuthenticated("未知错误")
	}
	user := v.(*ginx.CurrentUserInfo)
	result := &LoginResult{
		Code:     code,
		JwtToken: token,
		Expire:   expire.Local().Format(time.RFC3339),
		Address:  user.Address,
		UserName: user.UserName,
		Avatar:   user.Avatar,
	}
	c.JSON(http.StatusOK, result)
}

// @Summary      登出接口
// @Tags         User
// @Accept       json
// @Produce      json
// @Success      200  {object}  auth.LogoutResult
// @Router       /api/logout [post]
func jwtLogoutResponse(c *gin.Context, code int) {
	c.JSON(http.StatusOK, LogoutResult{
		Success: true,
		Code:    code,
	})
}

func authenticate(c *gin.Context, address common.Address, sig string, t identity.WalletType) (*ginx.CurrentUserInfo, error) {
	um := di.Get[identity.UserManager]()
	user := um.Login(c, address, sig, t)
	userInfo := NewCurrentUserInfo(user)
	return userInfo, nil
}

func authorize(user *ginx.CurrentUserInfo, c *gin.Context) bool {
	return true
}

func getSignMsg(ctx *gin.Context) {
	var input SignMessageInput
	err := ctx.BindJSON(&input)
	errx.CheckError(err)
	currentUser := ginx.CurrentUser(ctx)
	if !currentUser.Authenticated() {
		ginx.PanicUnAuthenticated("unauthenticated")
	}
	addr := common.HexToAddress(currentUser.Address)
	message := identity.CreateSignMessage(addr, input.SignType)
	ctx.JSON(http.StatusOK, SingMessageOutput{
		Message: message,
	})
}
