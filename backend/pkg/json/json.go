package json

import (
	"encoding/json"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
)

func Unmarshal[T any](data string) *T {
	var v T
	err := json.Unmarshal([]byte(data), &v)
	errx.CheckError(err)
	return &v
}

func Marshal(v any) string {
	str, err := json.Marshal(v)
	errx.CheckError(err)
	return string(str)
}
