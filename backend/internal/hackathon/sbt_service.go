package hackathon

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"hash/fnv"
	"math/big"

	"github.com/0xdeschool/deschool-lens/backend/build"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/eth"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
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

			// TODO: 这里需要不同 SBT 的技能映射表
			for j := 0; j < len(result.Sbts); j++ {
				result.Sbts[j].Address = eth.NormalizeAddress(result.Sbts[j].Address)
				skills[hash(fmt.Sprintf(result.Sbts[j].Address, result.Sbts[j].TokenId))%MAX_SKILL_NUM] += 1
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

// 哈希函数
func hash(s string) uint32 {
	h := fnv.New32a()
	h.Write([]byte(s))
	return h.Sum32()
}

// 自动发放一枚 Ensoul SBT
func (hm *HackathonManager) AutoSendEnsoulSbt(ctx context.Context, toAddressStr string, tokenIdStr string) bool {

	// 获取 Client 实例
	ho := *di.Get[HackathonOptions]()

	POLYGON_NETWORK := ho.PolygonNetwork
	INFURA_API_KEY := ho.InfuraApiKey
	url := fmt.Sprintf("https://%s.infura.io/v3/%s", POLYGON_NETWORK, INFURA_API_KEY)
	client, err := ethclient.Dial(url)
	errx.CheckError(err)

	// 链接 EnsoulV11 实例
	CONTRACT_ADDR := ho.ContractAddr
	PRIV_KEY_STR := ho.PrivKey
	ensoulV11, err := build.NewEnsoul(common.HexToAddress(CONTRACT_ADDR), client)
	errx.CheckError(err)

	// 准备 Signer
	privKey, err := crypto.HexToECDSA(PRIV_KEY_STR)
	errx.CheckError(err)

	publicKey := privKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		errx.Panic("unable to generate PubKey")
	}
	signerAddress := crypto.PubkeyToAddress(*publicKeyECDSA)

	// 准备 网络信息
	nonce, err := client.PendingNonceAt(context.Background(), signerAddress)
	errx.CheckError(err)

	gasPrice, err := client.SuggestGasPrice(context.Background())
	gasPrice = new(big.Int).Mul(gasPrice, big.NewInt(2))
	errx.CheckError(err)

	auth, err := bind.NewKeyedTransactorWithChainID(privKey, big.NewInt(137))
	errx.CheckError(err)

	// 设置数据
	bigTokenId := new(big.Int)
	bigTokenId, ok = bigTokenId.SetString(tokenIdStr, 10)
	if !ok {
		errx.Panic("Invalid tokenId given")
	}
	bigAmount := big.NewInt(1)
	toAddr := common.HexToAddress(toAddressStr)

	// 设置参数
	auth.Nonce = big.NewInt(int64(nonce))
	// auth.Value = big.NewInt(1000000000) // in wei
	// auth.GasLimit = uint64(3000000) // in units
	auth.GasPrice = gasPrice

	// 发送 tx
	tx, err := ensoulV11.Mint(auth, toAddr, bigTokenId, bigAmount)
	errx.CheckError(err)

	// 输出 tx 并等待挖出
	log.Infof("Ensoul mint tx sent: %s\n", tx.Hash().Hex())
	bind.WaitMined(context.Background(), client, tx)

	return true
}
