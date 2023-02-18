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
func (hm *HackathonManager) GetFollowing(ctx context.Context, addr string) []Follow {
	return hm.followRepo.GetListByFilter(ctx, addr, "fromAddr")
}

// 查询粉丝列表
func (hm *HackathonManager) GetFollower(ctx context.Context, addr string) []Follow {
	return hm.followRepo.GetListByFilter(ctx, addr, "toAddr")
}
