package hackathon

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/eth"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

// 链接验证 DeSchool ID
func (hm *HackathonManager) ValidateDeSchoolId(ctx context.Context, address string, baseAddress string, lensHandle string, platform int) bool {
	if platform != DeSchoolPlatform && platform != BoothPlatform && platform != LensPlatform {
		str := strconv.Itoa(int(platform))
		errx.Panic("unknown platform type to validate: " + str)
	}
	address = eth.NormalizeAddress(address)
	// Lens 已经完成了身份认证，黑客松版本先存储就好
	// result := verifySig(address, sig)
	result := true
	if result {
		// 通过 Address，BaseAddress 和 Platform 查重，不存在就插入
		exists := hm.idRepo.CheckExistsByAddrBaseAddrAndPltfm(ctx, address, baseAddress, PlatformType(platform))
		if !exists {
			verifiedId := Id{
				Platform:    PlatformType(platform),
				Address:     address,
				BaseAddress: baseAddress,
				LensHandle:  lensHandle,
			}
			verifiedId.CreatedAt = time.Now()

			hm.idRepo.Insert(ctx, &verifiedId)

			// 平台新用户进行空投
			if platform == BoothPlatform || platform == DeSchoolPlatform || platform == LensPlatform {
				go hm.airdropTwoTokens(address)
			}
		}
	}
	return result
}

func (hm *HackathonManager) airdropTwoTokens(toAddrStr string) {
	ctx := context.Background()
	const firstToken = "0"
	const secondToken = "1"
	hm.AutoSendEnsoulSbt(ctx, toAddrStr, firstToken)
	hm.AutoSendEnsoulSbt(ctx, toAddrStr, secondToken)
}

func verifySig(address string, sig string) bool {
	const VALIDATING_DESCHOOL_ID_STR = "I authorize Booth to link my DeSchool profile to Booth app."

	fromAddr := common.HexToAddress(address)
	sigData := hexutil.MustDecode(sig)
	if sigData[64] != 27 && sigData[64] != 28 {
		return false
	}
	sigData[64] -= 27

	pubKey, err := crypto.SigToPub(signHash([]byte(VALIDATING_DESCHOOL_ID_STR)), sigData)
	if err != nil {
		return false
	}

	recoveredAddr := crypto.PubkeyToAddress(*pubKey)

	return fromAddr == recoveredAddr
}

func signHash(data []byte) []byte {
	msg := fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(data), data)
	return crypto.Keccak256([]byte(msg))
}

// 获取所有链接过的身份列表
func (hm *HackathonManager) GetIdListByAddr(ctx context.Context, address string) []Id {
	return hm.idRepo.GetListByAddress(ctx, address)
}

// 获取新用户
func (hm *HackathonManager) GetNewIdList(ctx context.Context) []Id {
	return hm.idRepo.GetTen(ctx)
}
