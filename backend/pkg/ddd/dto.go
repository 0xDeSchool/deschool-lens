package ddd

type PagedResult[T any] struct {
	TotalCount int64 `json:"totalCount"`
	Items      []T   `json:"items"`
}

func NewPagedResult[T any](totalCount int64, items []T) PagedResult[T] {
	return PagedResult[T]{
		TotalCount: totalCount,
		Items:      items,
	}
}

type PagedItems[T any] struct {
	Items   []T  `json:"items"`
	HasNext bool `json:"hasNext"`
}

func NewPagedItems[T any](items []T, hasNext bool) PagedItems[T] {
	return PagedItems[T]{
		HasNext: hasNext,
		Items:   items,
	}
}
