package cache

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"sync"
	"time"
)

type Cache interface {
	Get(key string, v any) bool
	Set(key string, value any)
	Delete(key string)
	Exists(key string) bool
}

type CacheFactory interface {
	Create(options *CacheOptions) Cache
}

type CacheOptions struct {
	// 存活时长
	LifeWindow time.Duration
}

var (
	_cache Cache
	once   sync.Once
)

// 创建一个缓存对象
func New(options *CacheOptions) Cache {
	return getFactory().Create(options)
}

func Create(lifeWindow time.Duration) Cache {
	return New(&CacheOptions{
		LifeWindow: lifeWindow,
	})
}

func SetString(cache Cache, key string, v string) {
	cache.Set(key, v)
}

func GetString(cache Cache, key string) (string, bool) {
	v := ""
	ok := cache.Get(key, &v)
	return string(v), ok
}

func SetBool(cache Cache, key string, v bool) {
	cache.Set(key, v)
}

func GetBool(cache Cache, key string) (bool, bool) {
	v := false
	ok := cache.Get(key, &v)
	return v, ok
}

func Delete(cache Cache, key string) {
	cache.Delete(key)
}

func Exists(cache Cache, key string) bool {
	return cache.Exists(key)
}

func GetCache() Cache {
	once.Do(func() {
		_cache = getFactory().Create(&CacheOptions{
			LifeWindow: 10 * time.Minute,
		})
	})
	return _cache
}

func getFactory() CacheFactory {
	factory, ok := di.GetOptional[CacheFactory]()
	if !ok {
		f := newMememoryCacheFactory()
		factory = &f
	}
	return *factory
}
