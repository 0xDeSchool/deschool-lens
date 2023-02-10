package ginx

import (
	"context"
	"errors"
	"net/http"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ErrCodePageNotFound   errx.ErrCode = 100204
	ErrCodeEntityNotFound errx.ErrCode = 100244

	// 参数校验失败
	ErrCodeBadRequest errx.ErrCode = 100240
	// 未认证(登录)
	ErrCodeUnAuthenticated errx.ErrCode = 100241
	ErrCodeUnauthorized    errx.ErrCode = 100243
)

type ErrorHandFunc func(*gin.Context)

const ErrHandlersKey = "ErrorHandlers"

type ErrorHandlers struct {
	handlers []ErrorHandFunc
}

func NewErrorHandlers() *ErrorHandlers {
	return &ErrorHandlers{
		handlers: make([]ErrorHandFunc, 0),
	}
}

func (eh *ErrorHandlers) Run(c *gin.Context) {
	for i := range eh.handlers {
		eh.handlers[i](c)
	}
}
func (eh *ErrorHandlers) Add(h ErrorHandFunc) {
	eh.handlers = append(eh.handlers, h)
}

// request panic error handler
func ErorrMiddleware(c *gin.Context) {
	handlers := &ErrorHandlers{}
	c.Set(ErrHandlersKey, handlers)
	defer func() {
		if r := recover(); r != nil {
			handlers.Run(c)
			if err, ok := r.(*HttpError); ok {
				c.JSON(err.HttpStatus, *err)
				log.Error("请求出现错误", err)
			} else if err, ok := r.(error); ok {
				log.Error("请求出现错误", err)
				if errors.Is(err, mongo.ErrNoDocuments) {
					c.JSON(http.StatusNotFound, New(err))
				} else {
					c.JSON(http.StatusInternalServerError, New(err))
				}
			} else {
				log.Error("请求出现错误", err)
				c.JSON(http.StatusInternalServerError, NewUnkonwErr(r))
			}
			c.Abort()
		}
	}()
	c.Next()
}

// 添加请求生命周期中出现错误时的处理方法。
// 注意: 该方法中不要使用panic
func OnError(ctx context.Context, h ErrorHandFunc) {
	v := ctx.Value(ErrHandlersKey)
	if v != nil {
		v.(*ErrorHandlers).Add(h)
	}
}
