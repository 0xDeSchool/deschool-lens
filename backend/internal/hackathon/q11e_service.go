package hackathon

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/eth"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (hm *HackathonManager) PutQ11e(ctx context.Context, input Q11e) primitive.ObjectID {
	input.Address = eth.NormalizeAddress(input.Address)
	id := hm.q11eRepo.UpsertByField(ctx, "address", input.Address, input)
	return id
}

func (hm *HackathonManager) GetQ11e(ctx context.Context, address string) *Q11e {
	exists, result := hm.q11eRepo.CheckAndGetExistsByAddr(ctx, address)
	if !exists {
		return &Q11e{}
	}
	return result
}
