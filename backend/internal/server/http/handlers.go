package http

import (
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/db/mongodb"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"github.com/0xdeschool/deschool-lens/backend/pkg/x"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
	"strconv"

	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/eth"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"github.com/gin-gonic/gin"
)

func pingHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	data := hm.SayHello(ctx)
	ctx.JSON(http.StatusOK, data)
}

func idListHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	address := ctx.Query("address")
	address = eth.NormalizeAddress(address)
	data := hm.GetIdListByAddr(ctx, address)
	ctx.JSON(http.StatusOK, data)
}

func idValidateHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	var input IdValidateInput
	errx.CheckError(ctx.BindJSON(&input))
	input.Address = eth.NormalizeAddress(input.Address)
	input.BaseAddress = eth.NormalizeAddress(input.BaseAddress)
	result := hm.ValidateDeSchoolId(ctx, input.Address, input.BaseAddress, input.LensHandle, input.Platform)
	ctx.JSON(http.StatusOK, IdValidateOutput{Success: result})
}

func resumeGetHandler(ctx *gin.Context) {
	userIdOrAddr := ctx.Query("key")
	nonAutoGen := ginx.QueryBool(ctx, "non-auto-gen")
	if userIdOrAddr == "" {
		ginx.PanicValidatition("key is required")
	}
	um := di.Get[identity.UserManager]()
	user := um.Find(ctx, userIdOrAddr)
	if user == nil {
		ctx.JSON(http.StatusOK, nil)
		return
	}
	hm := di.Get[hackathon.HackathonManager]()
	resume := hm.GetResumeByAddr(ctx, user.ID, nonAutoGen)
	ctx.JSON(http.StatusOK, resume)
}

func resumePutHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	var input ResumePutInput
	errx.CheckError(ctx.BindJSON(&input))
	currentUser := ginx.CurrentUser(ctx)
	if !currentUser.Authenticated() {
		ginx.PanicUnAuthenticated("User is not authenticated")
	}
	id := hm.Insert(ctx, currentUser.ID, input.Data)
	ginx.EntityCreated(ctx, id.Hex())
}

func idNewHandle(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	result := hm.GetNewIdList(ctx)
	ctx.JSON(http.StatusOK, result)
}

func sbtDetailGetHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()

	address := ctx.Query("address")
	address = eth.NormalizeAddress(address)
	tokenIdStr := ctx.Query("tokenId")
	tokenId, err := strconv.Atoi(tokenIdStr)
	errx.CheckError(err)
	input := &GetSbtDetailInput{
		Address: address,
		TokenId: tokenId,
	}
	data := hm.GetSbtDetail(ctx, input.Address, input.TokenId)
	result := &GetSbtDetailOutput{
		Metadata: data.Metadata,
		Owners:   data.Owners,
	}
	ctx.JSON(http.StatusOK, result)
}

func idSbtDetailGetHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	address := ctx.Query("address")
	address = eth.NormalizeAddress(address)
	result := hm.GetIdSbtDetail(ctx, address)
	ctx.JSON(http.StatusOK, result)
}

func q11ePutHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	var input PutQ11eInput
	errx.CheckError(ctx.BindJSON(&input))
	id := hm.PutQ11e(ctx, NewQ11e(&input))
	ginx.EntityCreated(ctx, id.Hex())
}

func recommendationGetHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	userId := ctx.Query("userId")
	result := hm.RunRecommendations(ctx, mongodb.IDFromHex(userId))
	ur := *di.Get[identity.UserRepository]()
	u := ur.Get(ctx, result.TargetId)
	ctx.JSON(http.StatusOK, NewRecommendUserResult(result, u))
}

func q11eGetHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	userId := ctx.Query("userId")
	result := hm.GetQ11e(ctx, mongodb.IDFromHex(userId))
	ctx.JSON(http.StatusOK, result)
}

func testSbtPostHandler(ctx *gin.Context) {
	type input struct {
		ToAddr  string `json:"toAddr"`
		TokenId string `json:"tokenId"`
	}
	var i input
	errx.CheckError(ctx.BindJSON(&i))
	hm := *di.Get[hackathon.HackathonManager]()
	result := hm.AutoSendEnsoulSbt(ctx, i.ToAddr, i.TokenId)
	type Result struct {
		Success bool
	}
	ctx.JSON(http.StatusOK, &Result{Success: result})
}

func followGetHandler(ctx *gin.Context) {
	type followInput struct {
		ToUser   string `json:"toUser"`
		FromUser string `json:"fromUser"`
	}
	var input followInput

	input.FromUser = ctx.Query("fromUser")
	input.ToUser = ctx.Query("toUser")
	hm := *di.Get[hackathon.HackathonManager]()

	result := hm.CheckFollowExists(ctx, mongodb.IDFromHex(input.FromUser), mongodb.IDFromHex(input.ToUser))
	result2 := hm.CheckFollowExists(ctx, mongodb.IDFromHex(input.ToUser), mongodb.IDFromHex(input.FromUser))
	type Result struct {
		FromFollowedTo bool `json:"fromFollowedTo"`
		ToFollowedFrom bool `json:"ToFollowedFrom"`
	}
	ctx.JSON(http.StatusOK, &Result{FromFollowedTo: result, ToFollowedFrom: result2})
}

func followPostHandler(ctx *gin.Context) {
	type followInput struct {
		ToUser   string `json:"toUser"`
		FromUser string `json:"fromUser"`
	}
	var input followInput
	errx.CheckError(ctx.BindJSON(&input))
	if input.FromUser == "" || input.ToUser == "" {
		ginx.PanicValidatition("fromUser or toUser is empty")
	}
	if input.FromUser == input.ToUser {
		ginx.PanicValidatition("follow yourself is not allowed")
	}
	hm := *di.Get[hackathon.HackathonManager]()

	result := hm.InsertFollow(ctx, mongodb.IDFromHex(input.FromUser), mongodb.IDFromHex(input.ToUser))
	type Result struct {
		Success bool `json:"success"`
	}
	ctx.JSON(http.StatusOK, &Result{Success: result})
}

func followingGetHandler(ctx *gin.Context) {
	userId := ctx.Query("userId")

	visitorUserId := ctx.Query("visitorUserId")
	if visitorUserId == "" || visitorUserId == "undefined" {
		visitorUserId = userId
	}
	hm := *di.Get[hackathon.HackathonManager]()
	result := hm.GetFollowing(ctx, mongodb.IDFromHex(userId), mongodb.IDFromHex(visitorUserId))
	ctx.JSON(http.StatusOK, result)
}

func followerGetHandler(ctx *gin.Context) {
	userId := ctx.Query("userId")
	visitorUserId := ctx.Query("visitorUserId")
	if visitorUserId == "" || visitorUserId == "undefined" {
		visitorUserId = userId
	}
	hm := *di.Get[hackathon.HackathonManager]()
	result := hm.GetFollower(ctx, mongodb.IDFromHex(userId), mongodb.IDFromHex(visitorUserId))
	ctx.JSON(http.StatusOK, result)
}

func followDeleteHandler(ctx *gin.Context) {
	type followInput struct {
		ToUser   string `json:"toUser"`
		FromUser string `json:"fromUser"`
	}
	var input followInput
	errx.CheckError(ctx.BindJSON(&input))
	hm := *di.Get[hackathon.HackathonManager]()
	result := hm.DeleteFollow(ctx, mongodb.IDFromHex(input.FromUser), mongodb.IDFromHex(input.ToUser))
	type Result struct {
		Success bool `json:"success"`
	}
	ctx.JSON(http.StatusOK, &Result{Success: result})

}

func filterEvents(ctx *gin.Context) {
	var input hackathon.EventInput
	errx.CheckError(ctx.BindJSON(&input))
	result := hackathon.MatchEvents(ctx, input)
	ctx.JSON(http.StatusOK, result)
}

func getUsers(ctx *gin.Context) {
	um := *di.Get[identity.UserManager]()
	var users []identity.User
	userId := ctx.Query("userId")
	query := ginx.OptionalString(ctx, "q")

	platform := ginx.QueryInt(ctx, "platform", -1)
	hasNext := false
	if userId != "" {
		u := um.Repo.Get(ctx, mongodb.IDFromHex(userId))
		users = append(users, *u)
	} else {
		p := ginx.QueryPageAndSort(ctx)
		if p.Sort == "" {
			p.Sort = "-createdAt"
		}
		p.PageSize += 1
		var platformType *identity.UserPlatformType = nil
		if platform >= 0 {
			platformType = x.Ptr(identity.UserPlatformType(platform))
		}
		users = um.Repo.GetUsers(ctx, query, platformType, p)
		hasNext = len(users) >= int(p.PageSize)
		if hasNext {
			users = users[:p.PageSize-1]
		}
	}

	um.ManyIncludePlatforms(ctx, users)

	userIds := linq.Map(users, func(u *identity.User) primitive.ObjectID { return u.ID })
	currentUser := ginx.CurrentUser(ctx)
	if currentUser.Authenticated() {
		userIds = append(userIds, currentUser.ID)
	}
	fRepo := *di.Get[hackathon.FollowRepository]()
	followers := fRepo.GetFollowerCount(ctx, userIds)
	following := fRepo.GetFollowingCount(ctx, userIds)
	followingUsers := make(map[primitive.ObjectID]bool)
	if currentUser.Authenticated() {
		followingUsers = fRepo.CheckIsFollowing(ctx, currentUser.ID, userIds)
	}
	items := make([]*UserItem, 0, len(users))
	for i := range users {
		u := &users[i]
		item := NewUserItem(u)
		item.FollowerCount = followers[u.ID]
		item.FollowingCount = following[u.ID]
		item.IsFollowing = followingUsers[u.ID]
		items = append(items, item)
	}
	ctx.JSON(http.StatusOK, ddd.NewPagedItems(items, hasNext))
}
