package ddd

import (
	"encoding/json"
	"strconv"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Entity interface {
	GetId() primitive.ObjectID
}

type OrderEntity interface {
	GetOrder() float64
}

type OrderEntityBase struct {
	Order float64 `bson:"order"`
}

func (e OrderEntityBase) GetOrder() float64 {
	return e.Order
}

type EntityBase struct {
	ID primitive.ObjectID `bson:"_id,omitempty"`
}

func (e *EntityBase) GetId() primitive.ObjectID {
	return e.ID
}

type WithExtraEntity struct {
	Data map[string]string `bson:"data,omitempty"`
}

func (m *WithExtraEntity) SetProperty(key string, value interface{}) {
	if m.Data == nil {
		m.Data = make(map[string]string)
	}
	content, err := json.Marshal(value)
	if err == nil {
		m.Data[key] = string(content)
	}
}

func (m *WithExtraEntity) GetProperty(key string, value interface{}) (bool, error) {
	if m.Data == nil {
		return false, nil
	}
	content, ok := m.Data[key]
	if ok {
		err := json.Unmarshal([]byte(content), value)
		return true, err
	}
	return false, nil
}

func (m *WithExtraEntity) GetString(key string) string {
	if m.Data == nil {
		return ""
	}
	content, ok := m.Data[key]
	if ok {
		return content
	}
	return ""
}

func (m *WithExtraEntity) SetString(key string, value string) {
	if m.Data == nil {
		m.Data = make(map[string]string)
	}
	m.Data[key] = value
}

func (m *WithExtraEntity) GetInt(key string) int {
	if m.Data == nil {
		return 0
	}
	content, ok := m.Data[key]
	if ok {
		v, err := strconv.Atoi(content)
		errx.CheckError(err)
		return v
	}
	return 0
}

func (m *WithExtraEntity) SetInt(key string, value int) {
	if m.Data == nil {
		m.Data = make(map[string]string)
	}
	m.Data[key] = strconv.Itoa(value)
}

func (m *WithExtraEntity) GetFloat32(key string) float32 {
	if m.Data == nil {
		return 0
	}
	content, ok := m.Data[key]
	if ok {
		v, err := strconv.ParseFloat(content, 32)
		errx.CheckError(err)
		return float32(v)
	}
	return 0
}

func (m *WithExtraEntity) SetFloat32(key string, value float32) {
	if m.Data == nil {
		m.Data = make(map[string]string)
	}
	m.Data[key] = strconv.FormatFloat(float64(value), 'E', -1, 32)
}

type WithExtraArrayEntity struct {
	Data []string `bson:"data,omitempty"`
}

func (a *WithExtraArrayEntity) Append(str string) {
	if a.Data == nil {
		a.Data = make([]string, 0)
	}
	a.Data = append(a.Data, str)
}
