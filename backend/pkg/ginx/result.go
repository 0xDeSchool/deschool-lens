package ginx

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type DataResult[T any] struct {
	Success bool `json:"success"`
	Data    T    `json:"data"`
}

func JSON[T any](ctx *gin.Context, v T) {
	ctx.JSON(http.StatusOK, DataResult[T]{
		Data:    v,
		Success: true,
	})
}

type CreateEntityResult struct {
	ID string `json:"id"`
}

type CreateManyEntitiesResult struct {
	Count int `json:"count"`
}

type EntityUpdatedResult struct {
	Count int `json:"count"`
}

type SuccessWithMessageResult struct {
	Success bool   `json:"success"`
	Msg     string `json:"msg"`
}

func EntityCreated(ctx *gin.Context, id string) {
	ctx.JSON(http.StatusOK, CreateEntityResult{
		ID: id,
	})
}

func ManyEntitiesCreated(ctx *gin.Context, count int) {
	ctx.JSON(http.StatusOK, CreateManyEntitiesResult{
		Count: count,
	})
}

func EntityUpdated(ctx *gin.Context, count int) {
	ctx.JSON(http.StatusOK, EntityUpdatedResult{
		Count: count,
	})
}

func SuccessWithMessage(ctx *gin.Context, success bool, msg string) {
	ctx.JSON(http.StatusOK, SuccessWithMessageResult{
		Success: success,
		Msg:     msg,
	})
}
