package identity

import (
	"context"
	"fmt"
	"github.com/0xdeschool/deschool-lens/backend/pkg/ginx"
	"time"

	"github.com/0xdeschool/deschool-lens/backend/pkg/cache"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/eth"
	"github.com/0xdeschool/deschool-lens/backend/pkg/log"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/google/uuid"
)

type WalletType string

// SignType 签名的类型
type SignType string

const (
	// SignTypeLogin 登录签名
	SignTypeLogin SignType = "login"
	// SignTypeLink link platform 签名
	SignTypeLink SignType = "link"
)

const (
	MetaMask WalletType = "MetaMask"
	UniPass  WalletType = "UniPass"
)

var store = cache.Create(10 * time.Minute)

func CreateSignMessage(address common.Address, t SignType) string {
	uuid, err := uuid.NewUUID()
	errx.CheckError(err)
	nonce := uuid.String()
	signMsg := msg(nonce, t, map[string]string{})
	cache.SetString(store, string(t)+":"+address.Hex(), nonce)
	return signMsg
}

func VerifySignMessage(address common.Address, sign string, signType SignType, t WalletType) bool {
	hexAddr := address.Hex()
	k := string(signType) + ":" + hexAddr
	nonce, ok := cache.GetString(store, k)
	if ok {
		cache.Delete(store, k)
	} else {
		ginx.PanicValidatition("sign message expired")
	}
	message := msg(nonce, signType, map[string]string{})
	return verifySig(address, sign, message, t)
}

func verifySig(from common.Address, sigHex, signMessage string, t WalletType) bool {
	if t == MetaMask {
		return verifySigDefault(from, signMessage, sigHex)
	}
	if t == UniPass {
		return verifySigUniPass(from, signMessage, sigHex)
	}
	return false
}

func signHash(data []byte) []byte {
	msg := fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(data), data)
	return crypto.Keccak256([]byte(msg))
}

func verifySigDefault(addr common.Address, msg string, sig string) bool {
	sigData := hexutil.MustDecode(sig)
	if sigData[64] == 27 || sigData[64] == 28 {
		sigData[64] -= 27
	}

	pubKey, err := crypto.SigToPub(signHash([]byte(msg)), sigData)
	if err != nil {
		log.Warn("verifySigDefault" + err.Error())
		return false
	}

	recoveredAddr := crypto.PubkeyToAddress(*pubKey)

	return addr == recoveredAddr
}

func verifySigUniPass(addr common.Address, msg string, sig string) bool {
	c := di.Get[ethclient.Client]()
	sign := common.FromHex(sig)
	valid, err := eth.IsValidSignature(context.Background(), c, addr, []byte(msg), sign)
	errx.CheckError(err)
	return valid
}

func msg(nonce string, t SignType, data map[string]string) string {
	if t == SignTypeLogin {
		return "Booth is kindly requesting to Sign in securely, with nonce: " + nonce + ". Sign and login now, begin your journey to Booth!"
	} else if t == SignTypeLink {
		return "Booth is kindly requesting to link your account securely, with nonce: " + nonce + ". Sign and link now, begin your journey to Booth!"
	}
	return ""
}

func signCacheKey() {

}
