package errx

import "encoding/json"

type ValidationResult struct {
	FieldName string `json:"fieldName"`
	Message   string `json:"message"`
}

type ValidationError struct {
	ValidationErrors []*ValidationResult
}

func (v *ValidationError) Error() string {
	b, _ := json.Marshal(v.ValidationErrors)
	return "validation error: " + string(b)
}
