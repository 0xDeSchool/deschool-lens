package errx

import "strings"

type MultiError struct {
	message string
	errors  []errorInfo
}

func Errors(message string, errs ...error) MultiError {
	errInfo := make([]errorInfo, 0, len(errs))
	if len(errs) > 0 {
		for _, err := range errs {
			errInfo = append(errInfo, errorInfo{
				err:     err,
				message: err.Error(),
			})
		}
	}
	return MultiError{
		errors:  errInfo,
		message: message,
	}
}

func (err MultiError) Error() string {
	sb := strings.Builder{}
	if err.message == "" {
		sb.WriteString("发生错误:\n")
	} else {
		sb.WriteString(err.message + ":\n")

	}
	for _, e := range err.errors {
		if e.message != "" {
			sb.WriteString(e.message)
			sb.WriteString(": ")
		}
		sb.WriteString(e.err.Error())
		sb.WriteString("\n")
	}
	return sb.String()
}

func (e *MultiError) Add(message string, err error) {
	e.errors = append(e.errors, errorInfo{
		message: message,
		err:     err,
	})
}

func (e *MultiError) AddError(err error) {
	e.errors = append(e.errors, errorInfo{
		err: err,
	})
}

func (e *MultiError) HasError() bool {
	return e.errors != nil && len(e.errors) > 0
}
