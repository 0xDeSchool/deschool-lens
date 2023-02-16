package http

import (
	"fmt"
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
	fmt.Println(address)
	result := hm.RunRecommendations(ctx, address)
	ctx.JSON(http.StatusOK, result)
}
