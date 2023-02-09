package utils

import "reflect"

// 获取struct或Ptr对应的类型
func ElemTo(v interface{}) reflect.Type {
	t := reflect.TypeOf(v)
	if t.Kind() == reflect.Pointer {
		t = ElemTo(t.Elem())
	}
	return t
}

func Type[T interface{}]() reflect.Type {
	return reflect.TypeOf((*T)(nil)).Elem()
}
