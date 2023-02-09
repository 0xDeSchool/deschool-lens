package x

type PageParam struct {
	Page     int64 `json:"page"`     // 页码, 从1开始
	PageSize int64 `json:"pageSize"` // 每页大小
}

func (p *PageParam) Skip() int64 {
	return (p.Page - 1) * p.PageSize
}

func (p *PageParam) Limit() int64 {
	return p.PageSize
}

// NewPageParam new pageparam
func NewPageParam(page, pageSize int64) *PageParam {
	return &PageParam{
		Page:     page,
		PageSize: pageSize,
	}
}

type PageAndSort struct {
	PageParam `json:",inline"` // 页码, 从1开始
	Sort      string           `json:"sort"` // 排序字段, 例如: -createdAt, +updatedAt
}

func PageLimit(limit int) *PageAndSort {
	return &PageAndSort{
		PageParam: PageParam{
			Page:     1,
			PageSize: int64(limit),
		},
	}
}

// new page and sort
func NewPageAndSort(page, pageSize int64, sort string) *PageAndSort {
	return &PageAndSort{
		PageParam: PageParam{
			Page:     page,
			PageSize: pageSize,
		},
		Sort: sort,
	}
}

// is sorted by desc
func (p *PageAndSort) IsDesc() bool {
	return len(p.Sort) > 0 && p.Sort[0] == '-' || p.Sort[0] == '!'
}
