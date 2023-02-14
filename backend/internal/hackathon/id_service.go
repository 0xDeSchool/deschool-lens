package hackathon

import (
	"context"
	"fmt"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/eth"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

// 链接验证 DeSchool ID
func (hm *HackathonManager) ValidateDeSchoolId(ctx context.Context, sig string, address string, platform PlatformType) bool {
	if platform != DeSchoolPlatform && platform != BoothPlatform && platform != LensPlatform {
		errx.Panic("unknown platform type to validate: " + string(platform))
	}
	address = eth.NormalizeAddress(address)
	result := verifySig(address, sig)
	if result {
		verifiedId := Id{
			Platform: platform,
			Address:  address,
		}
		hm.idRepo.Insert(ctx, &verifiedId)
	}
	return result
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
