package hackathon

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/internal/identity"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// 查询双人关系
func (hm *HackathonManager) CheckFollowExists(ctx context.Context, fromUser primitive.ObjectID, toUser primitive.ObjectID) bool {
	return hm.followRepo.CheckExistsByToAndFromAddr(ctx, fromUser, toUser)
}

// 添加关系
func (hm *HackathonManager) InsertFollow(ctx context.Context, fromUser primitive.ObjectID, toUser primitive.ObjectID) bool {
	if hm.followRepo.CheckExistsByToAndFromAddr(ctx, fromUser, toUser) {
		return true
	}
	follow := &Follow{
		FromUser: fromUser,
		ToUser:   toUser,
	}
	follow.CreatedAt = time.Now()
	hm.followRepo.Insert(ctx, follow)
	return true
}

// 查询偶像列表
func (hm *HackathonManager) GetFollowing(ctx context.Context, userId primitive.ObjectID, vistorUserId primitive.ObjectID) []FollowingList {
	result := hm.followRepo.GetListByFilter(ctx, userId, "fromUser")
	userIds := linq.Map(result, func(i *Follow) primitive.ObjectID {
		return i.ToUser
	})
	userRepo := *di.Get[identity.UserRepository]()
	user := userRepo.GetMany(ctx, userIds)
	userMap := linq.ToMap(user, func(i *identity.User) primitive.ObjectID { return i.ID })
	var ret = make([]FollowingList, 0)
	for _, item := range result {
		u, ok := userMap[item.ToUser]
		if !ok {
			continue
		}
		ret = append(ret, FollowingList{
			Following: &UserItem{
				Id:          u.ID.Hex(),
				Avatar:      u.Avatar,
				DisplayName: u.DisplayName,
				Address:     u.Address,
			},
			VistorFollowedPerson: hm.CheckFollowExists(ctx, vistorUserId, item.ToUser),
			PersonFollowedVistor: hm.CheckFollowExists(ctx, item.ToUser, vistorUserId),
		})
	}
	return ret
}

// 查询粉丝列表
func (hm *HackathonManager) GetFollower(ctx context.Context, userId primitive.ObjectID, vistorUserId primitive.ObjectID) []FollowerList {
	result := hm.followRepo.GetListByFilter(ctx, userId, "toUser")
	userIds := linq.Map(result, func(i *Follow) primitive.ObjectID {
		return i.ToUser
	})
	userRepo := *di.Get[identity.UserRepository]()
	user := userRepo.GetMany(ctx, userIds)
	userMap := linq.ToMap(user, func(i *identity.User) primitive.ObjectID { return i.ID })
	var ret = make([]FollowerList, 0)
	for _, item := range result {
		u, ok := userMap[item.ToUser]
		if !ok {
			continue
		}
		ret = append(ret, FollowerList{
			Follower: &UserItem{
				Id:          u.ID.Hex(),
				Avatar:      u.Avatar,
				DisplayName: u.DisplayName,
				Address:     u.Address,
			},
			VistorFollowedPerson: hm.CheckFollowExists(ctx, vistorUserId, item.FromUser),
			PersonFollowedVistor: hm.CheckFollowExists(ctx, item.FromUser, vistorUserId),
		})
	}
	return ret
}

// 删除
func (hm *HackathonManager) DeleteFollow(ctx context.Context, fromUser primitive.ObjectID, toUser primitive.ObjectID) bool {
	hm.followRepo.DeleteByToAndFrom(ctx, fromUser, toUser)
	return true
}
