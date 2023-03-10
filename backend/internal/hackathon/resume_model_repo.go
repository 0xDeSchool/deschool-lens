package hackathon

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ddd"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Resume struct {
	ddd.FullAuditEntityBase `bson:",inline"`
	UserId                  primitive.ObjectID `bson:"userId" json:"userId"`
	Data                    string             `bson:"data" json:"data"`
	Address                 string             `bson:"address" json:"address"`
}

type ResumeRepository interface {
	ddd.RepositoryBase[Resume]
	GetByUserId(ctx context.Context, address primitive.ObjectID) *Resume
	CheckExists(ctx context.Context, userId primitive.ObjectID) bool
}
