package cache

import (
	"encoding/json"
	"errors"

	"github.com/allegro/bigcache/v3"
)

type memoryCacheFactory struct {
}

func (f *memoryCacheFactory) Create(opitons *CacheOptions) Cache {
	return newMemoryCache(opitons)
}

func newMememoryCacheFactory() CacheFactory {
	return &memoryCacheFactory{}
}

type memoryCache struct {
	cache *bigcache.BigCache
}

func newMemoryCache(options *CacheOptions) Cache {
	c := &memoryCache{}
	cache, _ := bigcache.NewBigCache(bigcache.DefaultConfig(options.LifeWindow))
	c.cache = cache
	return c
}

func (c *memoryCache) GetOrAdd(key string, creator func(k string) ([]byte, error)) []byte {
	item, err := c.cache.Get(key)
	if err != nil {
		item, err = creator(key)
		if err == nil && len(item) > 0 {
			item2, err := c.cache.Get(key)
			if err != nil {
				c.cache.Set(key, item)
			} else {
				item = item2
			}
		}
	}
	return item
}

func (c *memoryCache) Set(key string, v any) {
	value, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}
	err = c.cache.Set(key, value)
	if err != nil {
		panic(err)
	}
}

func (c *memoryCache) Get(key string, v any) bool {
	value, err := c.cache.Get(key)
	if errors.Is(err, bigcache.ErrEntryNotFound) {
		return false
	}
	err = json.Unmarshal(value, v)
	if err != nil {
		panic(err)
	}
	return true
}
func (c *memoryCache) Delete(key string) {
	c.cache.Delete(key)
}
func (c *memoryCache) Exists(key string) bool {
	_, err := c.cache.Get(key)
	return err == nil
}
