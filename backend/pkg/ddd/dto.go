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
