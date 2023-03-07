package hackathon

import (
	"context"
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

	var ret []FollowingList
	for _, item := range result {
		ret = append(ret, FollowingList{
			Following:            item.ToAddr,
			VistorFollowedPerson: hm.CheckFollowExists(ctx, vistorUserId, item.ToUser),
			PersonFollowedVistor: hm.CheckFollowExists(ctx, item.ToUser, vistorUserId),
		})
	}
	return ret
}

// 查询粉丝列表
func (hm *HackathonManager) GetFollower(ctx context.Context, userId primitive.ObjectID, vistorUserId primitive.ObjectID) []FollowerList {

	result := hm.followRepo.GetListByFilter(ctx, userId, "toAddr")

	var ret []FollowerList
	for _, item := range result {
		ret = append(ret, FollowerList{
			Follower:             item.FromAddr,
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
