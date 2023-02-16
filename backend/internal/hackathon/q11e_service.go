package hackathon

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (hm *HackathonManager) PutQ11e(ctx context.Context, input Q11e) primitive.ObjectID {
	id := hm.q11eRepo.UpsertByField(ctx, "address", input.Address, input)
	return id
}

func (hm *HackathonManager) GetQ11e(ctx context.Context, address string) Q11e {
	result := hm.q11eRepo.GetByAddress(ctx, address)
	return *result
}
