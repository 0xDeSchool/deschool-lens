package cache

import (
	"testing"
	"time"
)

func TestGetAndSet(t *testing.T) {
	cache := GetCache()
	testSetAndGet(t, cache, "test.bool", true)
	testSetAndGet(t, cache, "test.string", "test.value")
	testSetAndGet(t, cache, "test.int", 10)
	testSetAndGet(t, cache, "test.float", 10.0)
}

func TestExists(t *testing.T) {
	c := GetCache()
	testKey := "test.exists"
	c.Set(testKey, "true")
	if !c.Exists(testKey) {
		t.Fail()
	}
	if c.Exists(testKey + "not") {
		t.Fail()
	}
	c.Delete(testKey)
	if c.Exists(testKey) {
		t.Fail()
	}
}

func TestTimeout(t *testing.T) {
	testKey := "test.timeout"
	c := New(&CacheOptions{
		LifeWindow: 10 * time.Second,
	})
	c.Set(testKey, 10)
	if !c.Exists(testKey) {
		t.Fail()
	}
	time.Sleep(12 * time.Second)
	if c.Exists(testKey) {
		t.Fail()
	}
}

func testSetAndGet[T comparable](t *testing.T, c Cache, k string, v T) {
	c.Set(k, v)
	var mv T
	c.Get(k, &mv)
	if mv != v {
		t.Fail()
	}
}
