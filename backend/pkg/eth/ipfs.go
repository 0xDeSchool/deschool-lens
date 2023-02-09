package eth

import (
	"net/http"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	shell "github.com/ipfs/go-ipfs-api"
	httpapi "github.com/ipfs/go-ipfs-http-client"
)

type Ipfs struct {
	api   *httpapi.HttpApi
	shell *shell.Shell
}

type IpfsOptions struct {
	Url string
}

type TokenMeta map[string]string

func (t TokenMeta) ID() string {
	return t["id"]
}

func (t TokenMeta) Name() string {
	return t["name"]
}

func NewIpfsClient(options *IpfsOptions) *Ipfs {
	s, err := httpapi.NewURLApiWithClient(options.Url, http.DefaultClient)
	errx.CheckError(err)
	return &Ipfs{
		api:   s,
		shell: shell.NewShell(options.Url),
	}
}

func (ip *Ipfs) Shell() *shell.Shell {
	return ip.shell
}

func (ip *Ipfs) RemotePin() *RemotePinApi {
	return (*RemotePinApi)(ip.api)
}

func (ip *Ipfs) Files() *FilesApi {
	return (*FilesApi)(ip.api)
}

func ToFiles(path string) shell.AddOpts {
	return func(rb *shell.RequestBuilder) error {
		rb.Option("to-files", path)
		return nil
	}
}

func WrapWithDirectory(wrap bool) shell.AddOpts {
	return func(rb *shell.RequestBuilder) error {
		rb.Option("wrap-with-directory", wrap)
		return nil
	}
}
