package mongodb

import (
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func IDFromHex(id string) primitive.ObjectID {
	if id == "" {
		return primitive.NilObjectID
	}
	result, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		ginx.PanicValidatition(err.Error())
	}
	return result
}

func IDString(id primitive.ObjectID) string {
	if id.IsZero() {
		return ""
	}
	return id.Hex()
}
