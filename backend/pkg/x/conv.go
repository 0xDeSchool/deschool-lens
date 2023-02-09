package x

import (
	"strconv"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
)

func ToUint(s string) uint64 {
	if s == "" {
		return 0
	}
	v, err := strconv.ParseUint(s, 10, 64)
	errx.CheckError(err)
	return v
}

// CanConvert returns true if FromType can be converted to ToType.
func CanConvert[FromType any, ToType any]() bool {
	var v any = (*FromType)(nil)
	if _, ok := v.(ToType); ok {
		return ok
	}
	return false
}

func Ptr[T any](v T) *T {
	return &v
}
