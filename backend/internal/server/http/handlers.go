package http

import (
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
	hm := *di.Get[hackathon.HackathonManager]()
	address := ctx.Query("address")
	address = eth.NormalizeAddress(address)
	resume := hm.GetResumeByAddr(ctx, address)
	ctx.JSON(http.StatusOK, resume)
}

func resumePutHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	var input ResumePutInput
	errx.CheckError(ctx.BindJSON(&input))
	input.Address = eth.NormalizeAddress(input.Address)
	id := hm.InsertResumeByAddr(ctx, input.Address, input.Data)
	ginx.EntityCreated(ctx, id.Hex())
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
	id := hm.PutQ11e(ctx, *NewQ11e(&input))
	ginx.EntityCreated(ctx, id.Hex())
}

func recommendationGetHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	address := ctx.Query("address")
	address = eth.NormalizeAddress(address)
	result := hm.RunRecommendations(ctx, address)
	ctx.JSON(http.StatusOK, result)
}

func q11eGetHandler(ctx *gin.Context) {
	hm := *di.Get[hackathon.HackathonManager]()
	address := ctx.Query("address")
	address = eth.NormalizeAddress(address)
	result := hm.GetQ11e(ctx, address)
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
		ToAddr   string `json:"toAddr"`
		FromAddr string `json:"fromAddr"`
	}
	var input followInput

	input.FromAddr = ctx.Query("fromAddr")
	input.ToAddr = ctx.Query("toAddr")
	input.FromAddr = eth.NormalizeAddress(input.FromAddr)
	input.ToAddr = eth.NormalizeAddress(input.ToAddr)
	hm := *di.Get[hackathon.HackathonManager]()

	result := hm.CheckFollowExists(ctx, input.FromAddr, input.ToAddr)
	result2 := hm.CheckFollowExists(ctx, input.ToAddr, input.FromAddr)
	type Result struct {
		FromFollowedTo bool `json:"fromFollowedTo"`
		ToFollowedFrom bool `json:"ToFollowedFrom"`
	}
	ctx.JSON(http.StatusOK, &Result{FromFollowedTo: result, ToFollowedFrom: result2})
}

func followPostHandler(ctx *gin.Context) {
	type followInput struct {
		ToAddr   string `json:"toAddr"`
		FromAddr string `json:"fromAddr"`
	}
	var input followInput
	errx.CheckError(ctx.BindJSON(&input))
	input.FromAddr = eth.NormalizeAddress(input.FromAddr)
	input.ToAddr = eth.NormalizeAddress(input.ToAddr)
	hm := *di.Get[hackathon.HackathonManager]()

	result := hm.InsertFollow(ctx, input.FromAddr, input.ToAddr)
	type Result struct {
		Success bool `json:"success"`
	}
	ctx.JSON(http.StatusOK, &Result{Success: result})
}

func followingGetHandler(ctx *gin.Context) {
	addr := ctx.Query("addr")
	addr = eth.NormalizeAddress(addr)

	vistorAddr := ctx.Query("vistorAddress")
	vistorAddr = eth.NormalizeAddress(vistorAddr)

	hm := *di.Get[hackathon.HackathonManager]()
	result := hm.GetFollowing(ctx, addr, vistorAddr)
	ctx.JSON(http.StatusOK, result)
}

func followerGetHandler(ctx *gin.Context) {
	addr := ctx.Query("addr")
	addr = eth.NormalizeAddress(addr)

	vistorAddr := ctx.Query("vistorAddress")
	vistorAddr = eth.NormalizeAddress(vistorAddr)
	hm := *di.Get[hackathon.HackathonManager]()
	result := hm.GetFollower(ctx, addr, vistorAddr)
	ctx.JSON(http.StatusOK, result)
}

func followDeleteHandler(ctx *gin.Context) {
	type followInput struct {
		ToAddr   string `json:"toAddr"`
		FromAddr string `json:"fromAddr"`
	}
	var input followInput
	errx.CheckError(ctx.BindJSON(&input))
	input.FromAddr = eth.NormalizeAddress(input.FromAddr)
	input.ToAddr = eth.NormalizeAddress(input.ToAddr)
	hm := *di.Get[hackathon.HackathonManager]()
	result := hm.DeleteFollow(ctx, input.FromAddr, input.ToAddr)
	type Result struct {
		Success bool `json:"success"`
	}
	ctx.JSON(http.StatusOK, &Result{Success: result})

}
