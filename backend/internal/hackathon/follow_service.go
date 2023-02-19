package hackathon

import (
	"context"
	"time"
)

// 查询双人关系
func (hm *HackathonManager) CheckFollowExists(ctx context.Context, fromAddr string, toAddr string) bool {
	return hm.followRepo.CheckExistsByToAndFromAddr(ctx, fromAddr, toAddr)
}

// 添加关系
func (hm *HackathonManager) InsertFollow(ctx context.Context, fromAddr string, toAddr string) bool {
	if hm.followRepo.CheckExistsByToAndFromAddr(ctx, fromAddr, toAddr) {
		return true
	}
	follow := &Follow{
		FromAddr: fromAddr,
		ToAddr:   toAddr,
	}
	follow.CreatedAt = time.Now()
	hm.followRepo.Insert(ctx, follow)
	return true
}

// 查询偶像列表
func (hm *HackathonManager) GetFollowing(ctx context.Context, addr string, vistorAddr string) []FollowingList {

	if vistorAddr == "" {
		vistorAddr = addr
	}
	result := hm.followRepo.GetListByFilter(ctx, addr, "fromAddr")

	var ret []FollowingList
	for _, item := range result {
		ret = append(ret, FollowingList{
			Following:            item.ToAddr,
			VistorFollowedPerson: hm.CheckFollowExists(ctx, vistorAddr, item.FromAddr),
			PersonFollowedVistor: hm.CheckFollowExists(ctx, item.FromAddr, vistorAddr),
		})
	}
	return ret
}

// 查询粉丝列表
func (hm *HackathonManager) GetFollower(ctx context.Context, addr string, vistorAddr string) []FollowerList {
	if vistorAddr == "" {
		vistorAddr = addr
	}
	result := hm.followRepo.GetListByFilter(ctx, addr, "toAddr")

	var ret []FollowerList
	for _, item := range result {
		ret = append(ret, FollowerList{
			Follower:             item.FromAddr,
			VistorFollowedPerson: hm.CheckFollowExists(ctx, vistorAddr, item.FromAddr),
			PersonFollowedVistor: hm.CheckFollowExists(ctx, item.FromAddr, vistorAddr),
		})
	}
	return ret
}

// 删除
func (hm *HackathonManager) DeleteFollow(ctx context.Context, fromAddr string, toAddr string) bool {
	if !hm.followRepo.CheckExistsByToAndFromAddr(ctx, fromAddr, toAddr) {
		return true
	}
	hm.followRepo.DeleteByToAndFrom(ctx, fromAddr, toAddr)
	return true
}
