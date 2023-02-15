package hackathon

import (
	"context"
)

type SbtDetail struct {
	Metadata *NftMetaData
	Owners   []string
}

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
func (hm *HackathonManager) GetIdSbtDetail(ctx context.Context, address string) {

}
