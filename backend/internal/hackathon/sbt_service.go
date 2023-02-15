package hackathon

import (
	"context"
	"math/rand"
)

// 获取 SBT 的详情信息
func (hm *HackathonManager) GetSbtDetail(ctx context.Context, address string, tokenId int) *SbtDetail {
	metadata := GetNftMetadata(address, tokenId)
	owners := GetOwners(address, tokenId)
	return &SbtDetail{
		Metadata: metadata,
		Owners:   owners,
	}
}

// 获取一个 ID 的 SBT 信息
func (hm *HackathonManager) GetIdSbtDetail(ctx context.Context, address string) *IdSbtDetail {

	const MAX_SKILL_NUM = 6
	var skills [MAX_SKILL_NUM]int
	var result = IdSbtDetail{}

	// 获取所有链接过的 id 列表
	idArr := hm.idRepo.GetListByBaseAddr(ctx, address)
	for index, id := range idArr {
		// 先查重
		sameAddr := false
		for j := 0; j < index; j++ {
			if idArr[j].BaseAddress == id.BaseAddress {
				sameAddr = true
				break
			}
		}
		// 之前没有 Query 过的地址信息
		if !sameAddr {
			info := GetNftByWallet(id.Address)
			result.Sbts = append(result.Sbts, info.Result...)
			// TODO: 这里需要确认不同技能 SBT 的相加关系
			for j := 0; j < info.Total; j++ {
				skills[rand.Intn(MAX_SKILL_NUM)] += 1
			}
		}
	}

	// 将技能分数加到每一维度上
	for i := 0; i < MAX_SKILL_NUM; i++ {
		if skills[i] > 3 {
			result.Abilities[i] = 3
		} else {
			result.Abilities[i] = skills[i]
		}
	}
	return &result
}
