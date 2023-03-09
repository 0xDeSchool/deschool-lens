package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

func identityController(sb *server.ServerBuiler) {
	auth := ginx.AuthHandlerFunc(sb)
	altAuth := ginx.OptionalAuthHandlerFunc(sb)
	sb.Configure(func(s *server.Server) error {
		group := s.Route.Group("api/identity")
		group.POST("link", auth, linkPlatform)
		group.DELETE("link", auth, unlinkPlatform)
		group.PUT("", auth, updateUserInfo)
		group.GET("", altAuth, getUserInfo)

		return nil
	})
}

func updateUserInfo(ctx *gin.Context) {
	var input UserUpdateInput
	errx.CheckError(ctx.BindJSON(&input))
	currentUser := ginx.CurrentUser(ctx)
	if !currentUser.Authenticated() {
		ginx.PanicUnAuthenticated("unauthenticated")
	}
	um := di.Get[UserManager]()
	u := um.Find(ctx, currentUser.Address)
	if u == nil {
		ginx.PanicNotFound("user not found")
	}
	input.ToEntity(u)
	um.Update(ctx, u)
	ctx.JSON(http.StatusOK, struct{}{})
}

func getUserInfo(ctx *gin.Context) {
	addr := ctx.Query("user")
	currentUser := ginx.CurrentUser(ctx)
	if addr == "" {
		if !currentUser.Authenticated() {
			ginx.PanicValidatition("addr is required")
		}
		addr = currentUser.Address
	}
	um := di.Get[UserManager]()
	var u *User
	if primitive.IsValidObjectID(addr) {
		u = um.Repo.Get(ctx, mongodb.IDFromHex(addr))
	} else if common.IsHexAddress(addr) {
		u = um.Find(ctx, addr)
	} else {
		ginx.PanicValidatition("invalid user")
	}
	if u == nil {
		ginx.PanicNotFound("user not found")
	}
	ctx.JSON(http.StatusOK, NewUserInfo(u, currentUser.ID == u.ID))
}

func unlinkPlatform(ctx *gin.Context) {
	var input UnlinkPlatformInput
	errx.CheckError(ctx.BindJSON(&input))
	currentUser := ginx.CurrentUser(ctx)
	if !currentUser.Authenticated() {
		ginx.PanicUnAuthenticated("unauthenticated")
	}
	um := di.Get[UserManager]()
	um.Unlink(ctx, currentUser.ID, input.Platform, input.Address, input.Handle)
	ctx.JSON(http.StatusOK, struct{}{})
}

func linkPlatform(ctx *gin.Context) {
	var input LinkPlatformInput
	errx.CheckError(ctx.BindJSON(&input))
	currentUser := ginx.CurrentUser(ctx)
	if !currentUser.Authenticated() {
		ginx.PanicUnAuthenticated("unauthenticated")
	}
	um := di.Get[UserManager]()
	user := um.Repo.Get(ctx, currentUser.ID)
	data := input.ToEntity()
	data.UserId = currentUser.ID
	um.Link(ctx, data)
	needUpdate := false
	if user.DisplayName == user.Address && input.DisplayName != "" {
		user.DisplayName = input.DisplayName
		needUpdate = true
	}
	if user.Avatar == "" && input.Avatar != "" {
		user.Avatar = input.Avatar
		needUpdate = true
	}
	if needUpdate {
		um.Update(ctx, user)
	}
	ctx.JSON(http.StatusOK, struct{}{})
}
