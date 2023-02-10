package ginx

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CurrentUserInfo struct {
	ID       primitive.ObjectID
	UserName string
	Address  string
	Avatar   string
}

func (u *CurrentUserInfo) Authenticated() bool {
	return !u.ID.IsZero()
}

func CurrentUser(c context.Context) *CurrentUserInfo {
	user, ok := c.Value("Login.User").(*CurrentUserInfo)
	if !ok {
		return &CurrentUserInfo{
			ID: primitive.NilObjectID,
		}
	}
	return user
}
