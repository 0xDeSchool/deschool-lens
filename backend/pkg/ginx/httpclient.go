package ginx

import (
	"encoding/json"
	"errors"
	"net"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/go-resty/resty/v2"
)

var (
	client *resty.Client
	once   sync.Once
)

type HttpClientOptions struct {
	ProxyURL string
}

type RequestClient struct {
	options *HttpClientOptions
}

func NewRequestClient(hoptions *HttpClientOptions) *RequestClient {
	return &RequestClient{
		options: hoptions,
	}
}

func NewHttpClient(hoptions *HttpClientOptions) *http.Client {
	httpClient := &http.Client{}
	transport := &http.Transport{
		DialContext: (&net.Dialer{
			Timeout:   30 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		ForceAttemptHTTP2:     true,
		MaxIdleConns:          100,
		IdleConnTimeout:       60 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
	}
	if hoptions != nil && hoptions.ProxyURL != "" {
		proxyUrl, _ := url.Parse(hoptions.ProxyURL)
		transport.Proxy = http.ProxyURL(proxyUrl)
		log.Info("使用代理: " + hoptions.ProxyURL)
	}
	httpClient.Transport = transport
	return httpClient
}

func getDefaultClient(hoptions *HttpClientOptions) *resty.Client {
	once.Do(func() {
		hc := NewHttpClient(hoptions)
		client = resty.NewWithClient(hc).SetRetryCount(5).SetRetryWaitTime(time.Second * 3)
	})
	return client
}

func (c *RequestClient) GetResponse(url string, retry bool) (*http.Response, error) {
	hc := getDefaultClient(c.options)
	var request = hc.R().SetDoNotParseResponse(true).EnableTrace()
	if retry {
		request = request.AddRetryCondition(func(r *resty.Response, err error) bool {
			content := r.String()
			return err != nil || strings.Contains(content, "504 Gateway Time-out") || strings.Contains(content, "404 Not Found")
		})
	}
	resp, err := request.Get(url)
	if err != nil {
		return nil, err
	}
	return resp.RawResponse, nil
}

func (c *RequestClient) Get(url string, retry bool) ([]byte, error) {
	hc := getDefaultClient(c.options)
	var request = hc.R().EnableTrace()
	if retry {
		request = request.AddRetryCondition(func(r *resty.Response, err error) bool {
			content := r.String()
			return err != nil || strings.Contains(content, "504 Gateway Time-out") || strings.Contains(content, "404 Not Found")
		})
	}
	resp, err := request.Get(url)
	if err != nil {
		return []byte{}, err
	}
	if resp.StatusCode() >= 300 || resp.StatusCode() < 200 {
		return []byte{}, errors.New(string(resp.Body()))
	}
	return resp.Body(), nil
}

func (c *RequestClient) GetString(url string) (string, error) {
	hc := getDefaultClient(c.options)
	resp, err := hc.R().
		EnableTrace().
		Get(url)
	if err != nil {
		return "", err
	}
	return resp.String(), nil
}

func (c *RequestClient) GetObj(url string, result interface{}) error {
	content, err := c.Get(url, true)
	if err != nil {
		return err
	}
	return json.Unmarshal(content, result)
}

func (c *RequestClient) Post(url string, body any) (*http.Response, error) {
	hc := getDefaultClient(c.options)
	request := hc.R()
	request.Body = body
	request.SetDoNotParseResponse(true)
	resp, err := request.Post(url)
	if err != nil {
		return nil, err
	}
	return resp.RawResponse, nil
}
