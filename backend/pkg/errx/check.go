package errx

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

func NotNil(source interface{}, parameter string) {
	if source == nil {
		panic("参数:" + parameter + "能为nil")
	}
}

func NotEmpty(source string, parameter string) {
	if source == "" {
		panic("参数:" + parameter + "能为空")
	}
}

func Panic(errStr string) {
	panic(errStr)
}
