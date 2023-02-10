package di

import "reflect"

type ServiceScope int

type ServiceCreator func(c *Container) interface{}

const (
	Transient ServiceScope = 0
	Singleton ServiceScope = 1
	Scoped    ServiceScope = 2
)

type ServiceDescriptor struct {
	ServiceType reflect.Type
	Creator     ServiceCreator
	Scope       ServiceScope
	Value       interface{}
}

func NewServiceDescriptor(serviceType reflect.Type, creator ServiceCreator, scope ServiceScope) ServiceDescriptor {
	return ServiceDescriptor{
		ServiceType: serviceType,
		Creator:     creator,
		Scope:       scope,
	}
}
