package utils

import (
	"io/ioutil"
	"os/exec"

	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
)

func RunCmd(name string, arg ...string) error {
	cmd := exec.Command(name, arg...)
	stdout, err := cmd.StdoutPipe()
	if err != nil { //获取输出对象，可以从该对象中读取输出结果
		return err
	}
	defer stdout.Close()                // 保证关闭输出流
	if err := cmd.Start(); err != nil { // 运行命令
		return err
	}
	if opBytes, err := ioutil.ReadAll(stdout); err != nil { // 读取输出结果
		return err
	} else {
		log.Info(string(opBytes))
	}
	return nil
}
