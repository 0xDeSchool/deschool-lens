package eth

import (
	"bytes"
	"context"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/signer/core/apitypes"
	"golang.org/x/crypto/sha3"
)

// 0x1626ba7e
var EIP1271_SELECTOR = [32]byte{22, 38, 186, 126}

const UnipassMessagePrefix = "\x18UniPass Signed Message:\n"

const IsValidSignatureABI = "[{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"_hash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"_signature\",\"type\":\"bytes\"}],\"name\":\"isValidSignature\",\"outputs\":[{\"internalType\":\"bytes4\",\"name\":\"magicValue\",\"type\":\"bytes4\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]"

func UnipassHashMessage(message []byte) []byte {
	hasher := sha3.NewLegacyKeccak256()
	hasher.Write([]byte(UnipassMessagePrefix))
	hasher.Write([]byte(strconv.Itoa(len(message))))
	hasher.Write(message)
	return hasher.Sum(nil)
}

func IsValidSignature(
	ctx context.Context,
	client *ethclient.Client,
	account common.Address,
	msg, sig []byte,
) (bool, error) {
	accountABI, err := abi.JSON(strings.NewReader(IsValidSignatureABI))
	if err != nil {
		return false, err
	}
	messageHash := UnipassHashMessage(msg)
	msghash := [32]byte{}
	copy(msghash[:], messageHash)
	callData, err := accountABI.Pack("isValidSignature", msghash, sig)
	if err != nil {
		return false, err
	}
	result, err := client.CallContract(ctx, ethereum.CallMsg{
		To:   &account,
		Data: callData,
	}, nil)
	if err != nil {
		return false, err
	}

	return bytes.Equal(result, EIP1271_SELECTOR[:]), nil
}

func IsValidTypedSignature(
	ctx context.Context,
	client *ethclient.Client,
	account common.Address,
	data apitypes.TypedData,
	sig []byte,
) (bool, error) {
	accountABI, err := abi.JSON(strings.NewReader(IsValidSignatureABI))
	if err != nil {
		return false, err
	}

	messageHash, _, err := apitypes.TypedDataAndHash(data)
	if err != nil {
		return false, err
	}
	msghash := [32]byte{}
	copy(msghash[:], messageHash)
	callData, err := accountABI.Pack("isValidSignature", msghash, sig)
	if err != nil {
		return false, err
	}
	result, err := client.CallContract(ctx, ethereum.CallMsg{
		To:   &account,
		Data: callData,
	}, nil)
	if err != nil {
		return false, err
	}

	return bytes.Equal(result, EIP1271_SELECTOR[:]), nil
}
