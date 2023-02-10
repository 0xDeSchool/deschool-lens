package utils

import (
	"reflect"

	"github.com/spf13/viper"
)

func ViperBind(key string, dest interface{}) {
	ViperBindKey(viper.GetViper(), key, dest)
	viper.UnmarshalKey(key, dest)
}

func ViperBindKey(v *viper.Viper, key string, dest interface{}) {
	typeOfDest := reflect.TypeOf(dest)
	viperBindType(v, key, typeOfDest)
}

func viperBindType(v *viper.Viper, key string, typeOfDest reflect.Type) {
	sType := typeOfDest
	if sType.Kind() == reflect.Ptr {
		sType = typeOfDest.Elem()
	}
	if sType.Kind() != reflect.Struct {
		return
	}
	for i := 0; i < sType.NumField(); i++ {
		field := sType.Field(i)
		fieldType := field.Type
		if fieldType.Kind() == reflect.Ptr {
			fieldType = field.Type.Elem()
		}
		fieldKey := field.Tag.Get("mapstructure")
		if fieldKey == "" {
			fieldKey = field.Name
		}
		if key != "" {
			fieldKey = key + "." + fieldKey
		}
		if fieldType.Kind() == reflect.Struct {
			viperBindType(v, fieldKey, fieldType)
		} else {
			p := v.Get(fieldKey)
			v.Set(fieldKey, p)
		}
	}
}
