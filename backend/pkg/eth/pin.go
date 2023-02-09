package eth

import (
	"context"

	shell "github.com/ipfs/go-ipfs-api"
	httpapi "github.com/ipfs/go-ipfs-http-client"
)

type RemotePinApi httpapi.HttpApi

func (rp *RemotePinApi) Add(ctx context.Context, p *shell.LsLink) error {
	return rp.core().Request("pin/remote/add", p.Hash).
		Option("service", "pinata").
		Option("name", p.Name).
		Option("background", true).
		Exec(ctx, nil)
}

func (rp *RemotePinApi) Remove(ctx context.Context, name string) error {
	return rp.core().Request("pin/remote/rm").
		Option("service", "pinata").
		Option("name", name).
		Option("background", true).
		Option("force", true).
		Exec(ctx, nil)
}

func (rp *RemotePinApi) core() *httpapi.HttpApi {
	return (*httpapi.HttpApi)(rp)
}

type FilesApi httpapi.HttpApi

func (fa *FilesApi) core() *httpapi.HttpApi {
	return (*httpapi.HttpApi)(fa)
}
