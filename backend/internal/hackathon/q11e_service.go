package hackathon

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (hm *HackathonManager) PutQ11e(ctx context.Context, input Q11e) primitive.ObjectID {
	id := hm.q11eRepo.UpsertByField(ctx, "address", input.Address, input)
	return id
}
