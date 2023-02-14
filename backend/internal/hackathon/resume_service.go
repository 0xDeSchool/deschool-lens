package hackathon

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 查询用户简历
func (hm *HackathonManager) GetResumeByAddr(ctx context.Context, address string) Resume {
	result := hm.resumeRepo.FindOneByAddress(ctx, address)
	return *result
}

// 更新用户简历
func (hm *HackathonManager) InsertResumeByAddr(ctx context.Context, address string, data string) primitive.ObjectID {
	resumeObj := &Resume{
		Address: address,
		Data:    data,
	}
	id := hm.resumeRepo.UpsertByField(ctx, "address", address, *resumeObj)
	return id
}
