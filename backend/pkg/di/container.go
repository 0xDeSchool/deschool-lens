package di

import (
	"fmt"
	"reflect"
	"sync"
)

func newContainer() *Container {
	return &Container{
		Services: make([]ServiceDescriptor, 0),
		values:   sync.Map{},
	}
}

type Container struct {
	Services []ServiceDescriptor
	values   sync.Map
}

func (c *Container) Get(serviceType reflect.Type) interface{} {
	v, ok := c.GetOptional(serviceType)
	if !ok {
		panic(fmt.Sprintf("service %s not found", serviceType))
	}
	return v
}

// 获取对象，如果没有，返回nil
func (c *Container) GetOptional(serviceType reflect.Type) (interface{}, bool) {
	descriptor := c.firstOrDefault(serviceType)
	if descriptor == nil {
		return nil, false
	}
	return c.create(serviceType, descriptor), true
}

func (c *Container) GetArray(baseType reflect.Type) []interface{} {
	instances := make([]interface{}, 0)
	for i := 0; i < len(c.Services); i++ {
		v := &c.Services[i]
		implType := reflect.PtrTo(v.ServiceType)
		if v.ServiceType == baseType || implType == baseType || implType.AssignableTo(baseType) {
			instances = append(instances, c.create(v.ServiceType, v))
		}
	}
	return instances
}
func (c *Container) Add(descriptor ServiceDescriptor) {
	c.Services = append(c.Services, descriptor)
}

func (c *Container) TryAdd(descriptor ServiceDescriptor) {
	index := c.findIndex(&descriptor.ServiceType)
	if index < 0 {
		c.Services = append(c.Services, descriptor)
	}
}

func (c *Container) firstOrDefault(serviceType reflect.Type) *ServiceDescriptor {
	for i := 0; i < len(c.Services); i++ {
		v := &c.Services[i]
		if v.ServiceType == serviceType {
			return v
		}
	}
	return nil
}

func (c *Container) findIndex(serviceType *reflect.Type) int {
	for i := 0; i < len(c.Services); i++ {
		v := &c.Services[i]
		if v.ServiceType == *serviceType {
			return i
		}
	}
	return -1
}

func (c *Container) create(serviceType reflect.Type, descriptor *ServiceDescriptor) interface{} {
	if descriptor.Scope == Singleton {
		v, ok := c.values.Load(serviceType)
		if !ok {
			v, _ = c.values.LoadOrStore(serviceType, c.createInstance(descriptor))
		}
		return v
	} else if descriptor.Scope == Transient {
		return c.createInstance(descriptor)
	}
	panic("scope is not supported")
}

func (c *Container) createInstance(descriptor *ServiceDescriptor) interface{} {
	if descriptor.Value != nil {
		return descriptor.Value
	}
	if descriptor.Creator != nil {
		return descriptor.Creator(c)
	}
	return reflect.New(descriptor.ServiceType).Interface()
}
