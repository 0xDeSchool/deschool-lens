package hackathon

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (hm *HackathonManager) PutQ11e(ctx context.Context, address string, goals []string, fields []string, belief []string, mbti int) primitive.ObjectID {
	q11eObj := &Q11e{
		Address: address,
		Goals:   goals,
		Fields:  fields,
		Belief:  belief,
		Mbti:    MbtiType(mbti),
	}
	id := hm.q11eRepo.UpsertByField(ctx, "address", address, *q11eObj)
	return id
}
