package http

import (
	"encoding/json"
	"github.com/0xdeschool/deschool-lens/backend/internal/hackathon"
	"github.com/0xdeschool/deschool-lens/backend/internal/modules/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"strings"
)

func previewResumeCard(ctx *gin.Context) {
	addr := ctx.Param("address")
	replaceResume(ctx, addr)
}

func replaceResume(ctx *gin.Context, userAddr string) {
	headers, content := getHtml(ctx)
	userRepo := *di.Get[identity.UserRepository]()
	addr := common.HexToAddress(userAddr)
	u := userRepo.Find(ctx, addr)
	if u != nil && userAddr != "" {
		title := u.DisplayName
		if title == "" {
			title = u.Address
		}

		re := *di.Get[hackathon.ResumeRepository]()
		resume := re.GetByUserId(ctx, u.ID)
		if resume != nil {
			var resumeContent hackathon.ResumeContent
			err := json.Unmarshal([]byte(resume.Data), &resumeContent)
			if err == nil && len(resumeContent.Career) > 0 {
				car := resumeContent.Career[0]
				desc := "Check out my resume: " + car.Role + " of " + car.Project.Name
				content = replaceHtml(content, title, desc, u.Avatar)
			}
		}
	}
	reader := strings.NewReader(content)
	ctx.DataFromReader(http.StatusOK, reader.Size(), "text/html; charset=UTF-8", reader, getHeaders(headers))
}

func getHtml(ctx *gin.Context) (http.Header, string) {
	path := strings.Replace(ctx.Request.URL.RequestURI(), "app-bot/", "", 1)
	path = "https://booth.ink" + path
	resp, err := http.Get(path)
	errx.CheckError(err)
	defer resp.Body.Close()
	content, err := ioutil.ReadAll(resp.Body)
	errx.CheckError(err)
	return resp.Header, string(content)
}

func getHeaders(header http.Header) map[string]string {
	headers := map[string]string{}
	for k := range header {
		headers[k] = header.Get(k)
	}
	return headers
}

func replaceHtml(content string, title string, decription string, image string) string {
	strContent := content
	if title != "" {
		strContent = strings.ReplaceAll(
			content,
			"Booth: Best Cross-Chains Resume Tool",
			title,
		)
	}

	if decription != "" {
		strContent = strings.ReplaceAll(
			string(strContent),
			"Booth is a social layer to connect people through their knowledge and experience.\n\n    It's built by DeSchool, a platform bridging educators and learners though Web3 infrastructure to build a better education experience on-chain and seamlessly. Combined, we’re aiming to better support communities and individuals to build and access an open network of people, their knowledge, connections, and experience.",
			decription,
		)
	}

	if image != "" {
		strContent = strings.ReplaceAll(
			string(strContent),
			"https://deschool.s3.amazonaws.com/booth/booth_site.jpg?t=16771247891638",
			image,
		)
	}
	return strContent
}
