package ginx

import (
	"fmt"
	"net/http"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/gin-gonic/gin"
)

type HttpError struct {
	HttpStatus int          `json:"-"`
	Code       errx.ErrCode `json:"code"`
	Message    string       `json:"message"`
	Data       any          `json:"data"`
}

func (e *HttpError) Error() string {
	return fmt.Sprintf("http error: code: %d, msg: %s, httpstatus:%d", e.Code, e.Message, e.Code)
}

var UnhandledError = &HttpError{
	Message:    "服务器未处理异常",
	Code:       errx.ErrCodeUnkown,
	HttpStatus: http.StatusInternalServerError,
}

var ErrUnAuthenticated = &HttpError{
	Message:    "user not login",
	Code:       ErrCodeUnAuthenticated,
	HttpStatus: http.StatusUnauthorized,
}

var ErrUnauthorized = &HttpError{
	Message:    "permission forbidden",
	Code:       ErrCodeUnauthorized,
	HttpStatus: http.StatusUnauthorized,
}

func New(err error) HttpError {
	return HttpError{
		Message: err.Error(),
		Code:    errx.ErrCodeUnkown,
	}
}

var ErrPageNotFound = &HttpError{
	HttpStatus: http.StatusNotFound,
	Code:       ErrCodePageNotFound,
	Message:    "page not found",
}

func Error(ctx *gin.Context, err *HttpError) {
	ctx.JSON(err.HttpStatus, err)
}

func NotFound(ctx *gin.Context) {
	Error(ctx, ErrPageNotFound)
}

func EntityNotFound(ctx *gin.Context, msg string) {
	Error(ctx, &HttpError{
		HttpStatus: http.StatusNotFound,
		Code:       ErrCodePageNotFound,
		Message:    msg,
	})
}

func NewUnkonwErr(err any) HttpError {
	return HttpError{
		Message: fmt.Sprintf("未处理异常: %s", err),
		Code:    errx.ErrCodeUnkown,
	}
}

func Panic(code errx.ErrCode, message string) {
	panic(&HttpError{
		Message:    message,
		Code:       code,
		HttpStatus: http.StatusInternalServerError,
	})
}

func PanicErr(status int, code errx.ErrCode, message string) {
	panic(&HttpError{
		Message:    message,
		Code:       code,
		HttpStatus: status,
	})
}

func PanicNotFound(message string) {
	panic(&HttpError{
		Message:    message,
		Code:       ErrCodePageNotFound,
		HttpStatus: http.StatusNotFound,
	})
}

func PanicEntityNotFound(message string) {
	panic(&HttpError{
		Message:    message,
		Code:       ErrCodeEntityNotFound,
		HttpStatus: http.StatusNotFound,
	})
}

func PanicValidatition(message string) {
	panic(&HttpError{
		Message:    message,
		Code:       ErrCodeBadRequest,
		HttpStatus: http.StatusBadRequest,
	})
}

func PanicUnAuthenticated(message string) {
	panic(ErrUnAuthenticated)
}

func PanicUnAuthorized(message string) {
	panic(&HttpError{
		Message:    message,
		Code:       ErrCodeUnauthorized,
		HttpStatus: http.StatusForbidden,
	})
}
