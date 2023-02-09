package errx

import (
	"fmt"
	"runtime"

	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
)

// 纯数字表示，不同部位代表不同的服务，不同的模块
//
// 错误代码说明：100101
//
// - 10: 应用服务。
//
// - 01: 某个服务下的某个模块。
//
// - 01: 模块下的错误码序号，每个模块可以注册 100 个错误。
//
// 每个模块可以注册 100 个错误。
type ErrCode = int

var (

	// 未知错误
	ErrCodeUnkown ErrCode = 100000

	// 未知原因参数不合法
	ErrUnkownParameterUnvalid ErrCode = 100001
)

type errorInfo struct {
	message string
	err     error
}

func CatchPanic(message string) {
	if r := recover(); r != nil {
		log.Warn(fmt.Sprintf(message+": %s", r))
	}
}

func PrintStack() string {
	var buf [4096]byte
	n := runtime.Stack(buf[:], false)
	return string(buf[:n])
}
