package moralis

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
)

type MoralisOptions struct {
	ApiKey string
}

type Client struct {
	c       *http.Client
	baseUrl string
	opts    *MoralisOptions
}

type RequestParams struct {
	Chain  *string `json:"chain"`
	Limit  *int    `json:"limit"`
	Cursor *string `json:"cursor"`
}

func (rp *RequestParams) Query() map[string]string {
	query := map[string]string{}
	if rp.Chain != nil {
		query["chain"] = *rp.Chain
	}
	if rp.Limit != nil {
		query["limit"] = strconv.Itoa(*rp.Limit)
	}
	if rp.Cursor != nil {
		query["cursor"] = *rp.Cursor
	}
	return query
}

func New(c *http.Client, opts *MoralisOptions) *Client {
	return &Client{
		c:       c,
		opts:    opts,
		baseUrl: "https://deep-index.moralis.io/api/v2",
	}
}

func (mc *Client) get(path string, query map[string]string, result any) error {
	sb := strings.Builder{}
	sb.WriteString(mc.baseUrl)
	sb.WriteString(path)
	if query == nil {
		query = map[string]string{}
	}
	query["chain"] = "polygon"
	if len(query) > 0 {
		sb.WriteString("?")
		for k, v := range query {
			sb.WriteString(k)
			sb.WriteString("=")
			sb.WriteString(v)
			sb.WriteString("&")
		}
	}
	req, err := http.NewRequest("GET", sb.String(), nil)
	if err != nil {
		return err
	}
	req.Header.Add("accept", "application/json")
	req.Header.Add("X-API-Key", mc.opts.ApiKey)
	resp, err := mc.c.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	content, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	return json.Unmarshal(content, result)
}
