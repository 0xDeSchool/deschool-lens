package ginx

import (
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/gin-gonic/gin"
)

func Proxy(ctx *gin.Context, path string) {
	u, err := url.Parse(path)
	errx.CheckError(err)
	proxy := httputil.NewSingleHostReverseProxy(u)
	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		errx.CheckError(err)
	}
	proxy.ServeHTTP(ctx.Writer, ctx.Request)
}
