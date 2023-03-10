package hackathon

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 查询用户简历
func (hm *HackathonManager) GetResumeByAddr(ctx context.Context, userId primitive.ObjectID, address string, nonAutoGen bool) Resume {
	existed := hm.resumeRepo.CheckExists(ctx, userId)
	// 如果不存在 创建一个模板简历
	if !existed {
		var RESUME_DATA string
		if nonAutoGen {
			RESUME_DATA = "{\"career\":[],\"edu\":[]}"
		} else {
			RESUME_DATA = "{\"career\":[{\"title\":\"Booth Product Experiencer\",\"description\":\"I experienced Booth's novel product, which is the LinkedIn of the Web3 world, which can provide people with authentic and credible work and education experience SBT as resume proof. Through Booth, we link to better and more real Web3 workers. I have fully experienced this product and made valuable suggestions\",\"startTime\":\"2023-02-04T16:00:00.000Z\",\"endTime\":\"2023-02-04T16:00:00.000Z\",\"proofs\":[{\"address\":\"0x45DDB27dD9791957ae20781A2159D780A9626630\",\"tokenId\":\"0\",\"img\":\"https://www.ensoul.io/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fensoul-labs-image%2F9qdqo3Booth-logos.jpeg&w=256&q=75\"}],\"blockType\":1,\"order\":1}],\"edu\":[{\"title\":\"Booth & DeSchool Product Research\",\"description\":\"I learned the knowledge of Web3 products, and successfully logged into the Booth product by linking Metamask and lens. This is an important educational experience for me. I learned the basic usage of Web3 products, so I have a credible skill certification when I look for a Web3 job or communicate with people in DAO in the future.\",\"startTime\":\"2023-02-04T16:00:00.000Z\",\"endTime\":\"2023-02-04T16:00:00.000Z\",\"proofs\":[{\"address\":\"0x45DDB27dD9791957ae20781A2159D780A9626630\",\"tokenId\":\"1\",\"img\":\"https://www.ensoul.io/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fensoul-labs-image%2FqvsspbBooth-logos.jpeg&w=256&q=75\"}],\"blockType\":2,\"order\":1}]}"
		}

		hm.Insert(ctx, userId, address, RESUME_DATA)
	}
	result := hm.resumeRepo.GetByUserId(ctx, userId)
	return *result
}

// 更新用户简历
func (hm *HackathonManager) Insert(ctx context.Context, userId primitive.ObjectID, address string, data string) primitive.ObjectID {
	resumeObj := &Resume{
		UserId:  userId,
		Data:    data,
		Address: address,
	}
	id := hm.resumeRepo.UpsertByField(ctx, "userId", userId, resumeObj)
	return id
}
