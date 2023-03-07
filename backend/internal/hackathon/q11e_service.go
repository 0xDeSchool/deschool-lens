package hackathon

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (hm *HackathonManager) PutQ11e(ctx context.Context, input Q11e) primitive.ObjectID {
	id := hm.q11eRepo.UpsertByField(ctx, "userId", input.UserId, input)
	return id
}

func (hm *HackathonManager) GetQ11e(ctx context.Context, userId primitive.ObjectID) *Q11e {
	exists, result := hm.q11eRepo.CheckAndGetExistsByAddr(ctx, userId)
	if !exists {
		return &Q11e{}
	}
	return result
}
