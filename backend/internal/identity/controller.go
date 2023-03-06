package identity

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/server"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
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

		userGroup := s.Route.Group("api/users")
		userGroup.GET("", getUsers)
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
	addr := ctx.Query("addr")
	if addr == "" {
		currentUser := ginx.CurrentUser(ctx)
		if !currentUser.Authenticated() {
			ginx.PanicValidatition("addr is required")
		}
		addr = currentUser.Address
	}
	if !common.IsHexAddress(addr) {
		ginx.PanicValidatition("invalid address")
	}
	um := di.Get[UserManager]()
	u := um.Find(ctx, addr)
	if u == nil {
		ginx.PanicNotFound("user not found")
	}
	ctx.JSON(http.StatusOK, NewUserInfo(u))
}

func unlinkPlatform(ctx *gin.Context) {
	var input UnlinkPlatformInput
	errx.CheckError(ctx.BindJSON(&input))
	currentUser := ginx.CurrentUser(ctx)
	if !currentUser.Authenticated() {
		ginx.PanicUnAuthenticated("unauthenticated")
	}
	um := di.Get[UserManager]()
	um.Unlink(ctx, input.Platform, currentUser.Address, input.Handle)
	ctx.JSON(http.StatusOK, struct{}{})
}

func linkPlatform(ctx *gin.Context) {
	var input LinkPlatformInput
	errx.CheckError(ctx.BindJSON(&input))
	currentUser := ginx.CurrentUser(ctx)
	if !currentUser.Authenticated() {
		ginx.PanicUnAuthenticated("unauthenticated")
	}
	data := input.ToEntity()
	data.Address = currentUser.Address
	um := di.Get[UserManager]()
	um.Link(ctx, data)
	ctx.JSON(http.StatusOK, struct{}{})
}

func getUsers(ctx *gin.Context) {
	um := *di.Get[UserRepository]()
	p := ginx.QueryPageAndSort(ctx)
	if p.Sort == "" {
		p.Sort = "-createdAt"
	}
	p.PageSize += 1
	users := um.GetLatestUsers(ctx, p)
	hasNext := len(users) >= int(p.PageSize)
	if hasNext {
		users = users[:p.PageSize-1]
	}
	items := linq.Map(users, func(u *User) *UserInfo {
		return NewUserInfo(u)
	})
	ctx.JSON(http.StatusOK, ddd.NewPagedItems(items, hasNext))
}
