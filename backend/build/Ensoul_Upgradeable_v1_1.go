// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package build

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// EnsoulMetaData contains all meta data concerning the Ensoul contract.
var EnsoulMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"admin\",\"type\":\"address\"}],\"name\":\"AddOrgAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Allow\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Paused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"admin\",\"type\":\"address\"}],\"name\":\"RemoveOrgAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"RevokeAllow\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"ids\",\"type\":\"uint256[]\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"values\",\"type\":\"uint256[]\"}],\"name\":\"TransferBatch\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"TransferSingle\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"value\",\"type\":\"string\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"URI\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Unpaused\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"MINT_TO_BATCH_ADDRESS_TYPEHASH\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MINT_TYPEHASH\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"admin\",\"type\":\"address\"}],\"name\":\"addOrgAdmin\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"allow\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address[]\",\"name\":\"toList\",\"type\":\"address[]\"},{\"internalType\":\"uint256[]\",\"name\":\"tokenIdList\",\"type\":\"uint256[]\"}],\"name\":\"allowBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address[]\",\"name\":\"accounts\",\"type\":\"address[]\"},{\"internalType\":\"uint256[]\",\"name\":\"ids\",\"type\":\"uint256[]\"}],\"name\":\"balanceOfBatch\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"ids\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"amounts\",\"type\":\"uint256[]\"}],\"name\":\"burnBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"contractURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"exists\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"_tokenURI\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_contractURI\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"isAllow\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"mint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"mintBySignature\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address[]\",\"name\":\"toList\",\"type\":\"address[]\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"mintToBatchAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address[]\",\"name\":\"toList\",\"type\":\"address[]\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"mintToBatchAddressBySignature\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"orgAdmins\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"pause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"revokeAllow\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address[]\",\"name\":\"toList\",\"type\":\"address[]\"},{\"internalType\":\"uint256[]\",\"name\":\"tokenIdList\",\"type\":\"uint256[]\"}],\"name\":\"revokeAllowBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"admin\",\"type\":\"address\"}],\"name\":\"revokeOrgAdmin\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"name\":\"safeBatchTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"contractURI_\",\"type\":\"string\"}],\"name\":\"setContractURI\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"newName\",\"type\":\"string\"}],\"name\":\"setName\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"newuri\",\"type\":\"string\"}],\"name\":\"setURI\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"unpause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"uri\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"usedSignature\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"version\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"pure\",\"type\":\"function\"}]",
}

// EnsoulABI is the input ABI used to generate the binding from.
// Deprecated: Use EnsoulMetaData.ABI instead.
var EnsoulABI = EnsoulMetaData.ABI

// Ensoul is an auto generated Go binding around an Ethereum contract.
type Ensoul struct {
	EnsoulCaller     // Read-only binding to the contract
	EnsoulTransactor // Write-only binding to the contract
	EnsoulFilterer   // Log filterer for contract events
}

// EnsoulCaller is an auto generated read-only Go binding around an Ethereum contract.
type EnsoulCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// EnsoulTransactor is an auto generated write-only Go binding around an Ethereum contract.
type EnsoulTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// EnsoulFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type EnsoulFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// EnsoulSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type EnsoulSession struct {
	Contract     *Ensoul           // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// EnsoulCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type EnsoulCallerSession struct {
	Contract *EnsoulCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// EnsoulTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type EnsoulTransactorSession struct {
	Contract     *EnsoulTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// EnsoulRaw is an auto generated low-level Go binding around an Ethereum contract.
type EnsoulRaw struct {
	Contract *Ensoul // Generic contract binding to access the raw methods on
}

// EnsoulCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type EnsoulCallerRaw struct {
	Contract *EnsoulCaller // Generic read-only contract binding to access the raw methods on
}

// EnsoulTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type EnsoulTransactorRaw struct {
	Contract *EnsoulTransactor // Generic write-only contract binding to access the raw methods on
}

// NewEnsoul creates a new instance of Ensoul, bound to a specific deployed contract.
func NewEnsoul(address common.Address, backend bind.ContractBackend) (*Ensoul, error) {
	contract, err := bindEnsoul(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Ensoul{EnsoulCaller: EnsoulCaller{contract: contract}, EnsoulTransactor: EnsoulTransactor{contract: contract}, EnsoulFilterer: EnsoulFilterer{contract: contract}}, nil
}

// NewEnsoulCaller creates a new read-only instance of Ensoul, bound to a specific deployed contract.
func NewEnsoulCaller(address common.Address, caller bind.ContractCaller) (*EnsoulCaller, error) {
	contract, err := bindEnsoul(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &EnsoulCaller{contract: contract}, nil
}

// NewEnsoulTransactor creates a new write-only instance of Ensoul, bound to a specific deployed contract.
func NewEnsoulTransactor(address common.Address, transactor bind.ContractTransactor) (*EnsoulTransactor, error) {
	contract, err := bindEnsoul(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &EnsoulTransactor{contract: contract}, nil
}

// NewEnsoulFilterer creates a new log filterer instance of Ensoul, bound to a specific deployed contract.
func NewEnsoulFilterer(address common.Address, filterer bind.ContractFilterer) (*EnsoulFilterer, error) {
	contract, err := bindEnsoul(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &EnsoulFilterer{contract: contract}, nil
}

// bindEnsoul binds a generic wrapper to an already deployed contract.
func bindEnsoul(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(EnsoulABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Ensoul *EnsoulRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Ensoul.Contract.EnsoulCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Ensoul *EnsoulRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Ensoul.Contract.EnsoulTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Ensoul *EnsoulRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Ensoul.Contract.EnsoulTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Ensoul *EnsoulCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Ensoul.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Ensoul *EnsoulTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Ensoul.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Ensoul *EnsoulTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Ensoul.Contract.contract.Transact(opts, method, params...)
}

// MINTTOBATCHADDRESSTYPEHASH is a free data retrieval call binding the contract method 0xd0587324.
//
// Solidity: function MINT_TO_BATCH_ADDRESS_TYPEHASH() view returns(bytes32)
func (_Ensoul *EnsoulCaller) MINTTOBATCHADDRESSTYPEHASH(opts *bind.CallOpts) ([32]byte, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "MINT_TO_BATCH_ADDRESS_TYPEHASH")

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// MINTTOBATCHADDRESSTYPEHASH is a free data retrieval call binding the contract method 0xd0587324.
//
// Solidity: function MINT_TO_BATCH_ADDRESS_TYPEHASH() view returns(bytes32)
func (_Ensoul *EnsoulSession) MINTTOBATCHADDRESSTYPEHASH() ([32]byte, error) {
	return _Ensoul.Contract.MINTTOBATCHADDRESSTYPEHASH(&_Ensoul.CallOpts)
}

// MINTTOBATCHADDRESSTYPEHASH is a free data retrieval call binding the contract method 0xd0587324.
//
// Solidity: function MINT_TO_BATCH_ADDRESS_TYPEHASH() view returns(bytes32)
func (_Ensoul *EnsoulCallerSession) MINTTOBATCHADDRESSTYPEHASH() ([32]byte, error) {
	return _Ensoul.Contract.MINTTOBATCHADDRESSTYPEHASH(&_Ensoul.CallOpts)
}

// MINTTYPEHASH is a free data retrieval call binding the contract method 0xf76fc35e.
//
// Solidity: function MINT_TYPEHASH() view returns(bytes32)
func (_Ensoul *EnsoulCaller) MINTTYPEHASH(opts *bind.CallOpts) ([32]byte, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "MINT_TYPEHASH")

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// MINTTYPEHASH is a free data retrieval call binding the contract method 0xf76fc35e.
//
// Solidity: function MINT_TYPEHASH() view returns(bytes32)
func (_Ensoul *EnsoulSession) MINTTYPEHASH() ([32]byte, error) {
	return _Ensoul.Contract.MINTTYPEHASH(&_Ensoul.CallOpts)
}

// MINTTYPEHASH is a free data retrieval call binding the contract method 0xf76fc35e.
//
// Solidity: function MINT_TYPEHASH() view returns(bytes32)
func (_Ensoul *EnsoulCallerSession) MINTTYPEHASH() ([32]byte, error) {
	return _Ensoul.Contract.MINTTYPEHASH(&_Ensoul.CallOpts)
}

// BalanceOf is a free data retrieval call binding the contract method 0x00fdd58e.
//
// Solidity: function balanceOf(address account, uint256 id) view returns(uint256)
func (_Ensoul *EnsoulCaller) BalanceOf(opts *bind.CallOpts, account common.Address, id *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "balanceOf", account, id)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x00fdd58e.
//
// Solidity: function balanceOf(address account, uint256 id) view returns(uint256)
func (_Ensoul *EnsoulSession) BalanceOf(account common.Address, id *big.Int) (*big.Int, error) {
	return _Ensoul.Contract.BalanceOf(&_Ensoul.CallOpts, account, id)
}

// BalanceOf is a free data retrieval call binding the contract method 0x00fdd58e.
//
// Solidity: function balanceOf(address account, uint256 id) view returns(uint256)
func (_Ensoul *EnsoulCallerSession) BalanceOf(account common.Address, id *big.Int) (*big.Int, error) {
	return _Ensoul.Contract.BalanceOf(&_Ensoul.CallOpts, account, id)
}

// BalanceOfBatch is a free data retrieval call binding the contract method 0x4e1273f4.
//
// Solidity: function balanceOfBatch(address[] accounts, uint256[] ids) view returns(uint256[])
func (_Ensoul *EnsoulCaller) BalanceOfBatch(opts *bind.CallOpts, accounts []common.Address, ids []*big.Int) ([]*big.Int, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "balanceOfBatch", accounts, ids)

	if err != nil {
		return *new([]*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new([]*big.Int)).(*[]*big.Int)

	return out0, err

}

// BalanceOfBatch is a free data retrieval call binding the contract method 0x4e1273f4.
//
// Solidity: function balanceOfBatch(address[] accounts, uint256[] ids) view returns(uint256[])
func (_Ensoul *EnsoulSession) BalanceOfBatch(accounts []common.Address, ids []*big.Int) ([]*big.Int, error) {
	return _Ensoul.Contract.BalanceOfBatch(&_Ensoul.CallOpts, accounts, ids)
}

// BalanceOfBatch is a free data retrieval call binding the contract method 0x4e1273f4.
//
// Solidity: function balanceOfBatch(address[] accounts, uint256[] ids) view returns(uint256[])
func (_Ensoul *EnsoulCallerSession) BalanceOfBatch(accounts []common.Address, ids []*big.Int) ([]*big.Int, error) {
	return _Ensoul.Contract.BalanceOfBatch(&_Ensoul.CallOpts, accounts, ids)
}

// ContractURI is a free data retrieval call binding the contract method 0xe8a3d485.
//
// Solidity: function contractURI() view returns(string)
func (_Ensoul *EnsoulCaller) ContractURI(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "contractURI")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// ContractURI is a free data retrieval call binding the contract method 0xe8a3d485.
//
// Solidity: function contractURI() view returns(string)
func (_Ensoul *EnsoulSession) ContractURI() (string, error) {
	return _Ensoul.Contract.ContractURI(&_Ensoul.CallOpts)
}

// ContractURI is a free data retrieval call binding the contract method 0xe8a3d485.
//
// Solidity: function contractURI() view returns(string)
func (_Ensoul *EnsoulCallerSession) ContractURI() (string, error) {
	return _Ensoul.Contract.ContractURI(&_Ensoul.CallOpts)
}

// Exists is a free data retrieval call binding the contract method 0x4f558e79.
//
// Solidity: function exists(uint256 id) view returns(bool)
func (_Ensoul *EnsoulCaller) Exists(opts *bind.CallOpts, id *big.Int) (bool, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "exists", id)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// Exists is a free data retrieval call binding the contract method 0x4f558e79.
//
// Solidity: function exists(uint256 id) view returns(bool)
func (_Ensoul *EnsoulSession) Exists(id *big.Int) (bool, error) {
	return _Ensoul.Contract.Exists(&_Ensoul.CallOpts, id)
}

// Exists is a free data retrieval call binding the contract method 0x4f558e79.
//
// Solidity: function exists(uint256 id) view returns(bool)
func (_Ensoul *EnsoulCallerSession) Exists(id *big.Int) (bool, error) {
	return _Ensoul.Contract.Exists(&_Ensoul.CallOpts, id)
}

// IsAllow is a free data retrieval call binding the contract method 0xc3b165a0.
//
// Solidity: function isAllow(address sender, uint256 tokenId) view returns(bool)
func (_Ensoul *EnsoulCaller) IsAllow(opts *bind.CallOpts, sender common.Address, tokenId *big.Int) (bool, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "isAllow", sender, tokenId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsAllow is a free data retrieval call binding the contract method 0xc3b165a0.
//
// Solidity: function isAllow(address sender, uint256 tokenId) view returns(bool)
func (_Ensoul *EnsoulSession) IsAllow(sender common.Address, tokenId *big.Int) (bool, error) {
	return _Ensoul.Contract.IsAllow(&_Ensoul.CallOpts, sender, tokenId)
}

// IsAllow is a free data retrieval call binding the contract method 0xc3b165a0.
//
// Solidity: function isAllow(address sender, uint256 tokenId) view returns(bool)
func (_Ensoul *EnsoulCallerSession) IsAllow(sender common.Address, tokenId *big.Int) (bool, error) {
	return _Ensoul.Contract.IsAllow(&_Ensoul.CallOpts, sender, tokenId)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_Ensoul *EnsoulCaller) IsApprovedForAll(opts *bind.CallOpts, arg0 common.Address, arg1 common.Address) (bool, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "isApprovedForAll", arg0, arg1)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_Ensoul *EnsoulSession) IsApprovedForAll(arg0 common.Address, arg1 common.Address) (bool, error) {
	return _Ensoul.Contract.IsApprovedForAll(&_Ensoul.CallOpts, arg0, arg1)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_Ensoul *EnsoulCallerSession) IsApprovedForAll(arg0 common.Address, arg1 common.Address) (bool, error) {
	return _Ensoul.Contract.IsApprovedForAll(&_Ensoul.CallOpts, arg0, arg1)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Ensoul *EnsoulCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Ensoul *EnsoulSession) Name() (string, error) {
	return _Ensoul.Contract.Name(&_Ensoul.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Ensoul *EnsoulCallerSession) Name() (string, error) {
	return _Ensoul.Contract.Name(&_Ensoul.CallOpts)
}

// OrgAdmins is a free data retrieval call binding the contract method 0x2da582fd.
//
// Solidity: function orgAdmins(address ) view returns(bool)
func (_Ensoul *EnsoulCaller) OrgAdmins(opts *bind.CallOpts, arg0 common.Address) (bool, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "orgAdmins", arg0)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// OrgAdmins is a free data retrieval call binding the contract method 0x2da582fd.
//
// Solidity: function orgAdmins(address ) view returns(bool)
func (_Ensoul *EnsoulSession) OrgAdmins(arg0 common.Address) (bool, error) {
	return _Ensoul.Contract.OrgAdmins(&_Ensoul.CallOpts, arg0)
}

// OrgAdmins is a free data retrieval call binding the contract method 0x2da582fd.
//
// Solidity: function orgAdmins(address ) view returns(bool)
func (_Ensoul *EnsoulCallerSession) OrgAdmins(arg0 common.Address) (bool, error) {
	return _Ensoul.Contract.OrgAdmins(&_Ensoul.CallOpts, arg0)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Ensoul *EnsoulCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Ensoul *EnsoulSession) Owner() (common.Address, error) {
	return _Ensoul.Contract.Owner(&_Ensoul.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Ensoul *EnsoulCallerSession) Owner() (common.Address, error) {
	return _Ensoul.Contract.Owner(&_Ensoul.CallOpts)
}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_Ensoul *EnsoulCaller) Paused(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "paused")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_Ensoul *EnsoulSession) Paused() (bool, error) {
	return _Ensoul.Contract.Paused(&_Ensoul.CallOpts)
}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_Ensoul *EnsoulCallerSession) Paused() (bool, error) {
	return _Ensoul.Contract.Paused(&_Ensoul.CallOpts)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Ensoul *EnsoulCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Ensoul *EnsoulSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Ensoul.Contract.SupportsInterface(&_Ensoul.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Ensoul *EnsoulCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Ensoul.Contract.SupportsInterface(&_Ensoul.CallOpts, interfaceId)
}

// TotalSupply is a free data retrieval call binding the contract method 0xbd85b039.
//
// Solidity: function totalSupply(uint256 id) view returns(uint256)
func (_Ensoul *EnsoulCaller) TotalSupply(opts *bind.CallOpts, id *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "totalSupply", id)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalSupply is a free data retrieval call binding the contract method 0xbd85b039.
//
// Solidity: function totalSupply(uint256 id) view returns(uint256)
func (_Ensoul *EnsoulSession) TotalSupply(id *big.Int) (*big.Int, error) {
	return _Ensoul.Contract.TotalSupply(&_Ensoul.CallOpts, id)
}

// TotalSupply is a free data retrieval call binding the contract method 0xbd85b039.
//
// Solidity: function totalSupply(uint256 id) view returns(uint256)
func (_Ensoul *EnsoulCallerSession) TotalSupply(id *big.Int) (*big.Int, error) {
	return _Ensoul.Contract.TotalSupply(&_Ensoul.CallOpts, id)
}

// Uri is a free data retrieval call binding the contract method 0x0e89341c.
//
// Solidity: function uri(uint256 ) view returns(string)
func (_Ensoul *EnsoulCaller) Uri(opts *bind.CallOpts, arg0 *big.Int) (string, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "uri", arg0)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Uri is a free data retrieval call binding the contract method 0x0e89341c.
//
// Solidity: function uri(uint256 ) view returns(string)
func (_Ensoul *EnsoulSession) Uri(arg0 *big.Int) (string, error) {
	return _Ensoul.Contract.Uri(&_Ensoul.CallOpts, arg0)
}

// Uri is a free data retrieval call binding the contract method 0x0e89341c.
//
// Solidity: function uri(uint256 ) view returns(string)
func (_Ensoul *EnsoulCallerSession) Uri(arg0 *big.Int) (string, error) {
	return _Ensoul.Contract.Uri(&_Ensoul.CallOpts, arg0)
}

// UsedSignature is a free data retrieval call binding the contract method 0xf9afb455.
//
// Solidity: function usedSignature(uint8 v, bytes32 r, bytes32 s) view returns(bool)
func (_Ensoul *EnsoulCaller) UsedSignature(opts *bind.CallOpts, v uint8, r [32]byte, s [32]byte) (bool, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "usedSignature", v, r, s)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// UsedSignature is a free data retrieval call binding the contract method 0xf9afb455.
//
// Solidity: function usedSignature(uint8 v, bytes32 r, bytes32 s) view returns(bool)
func (_Ensoul *EnsoulSession) UsedSignature(v uint8, r [32]byte, s [32]byte) (bool, error) {
	return _Ensoul.Contract.UsedSignature(&_Ensoul.CallOpts, v, r, s)
}

// UsedSignature is a free data retrieval call binding the contract method 0xf9afb455.
//
// Solidity: function usedSignature(uint8 v, bytes32 r, bytes32 s) view returns(bool)
func (_Ensoul *EnsoulCallerSession) UsedSignature(v uint8, r [32]byte, s [32]byte) (bool, error) {
	return _Ensoul.Contract.UsedSignature(&_Ensoul.CallOpts, v, r, s)
}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() pure returns(string)
func (_Ensoul *EnsoulCaller) Version(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Ensoul.contract.Call(opts, &out, "version")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() pure returns(string)
func (_Ensoul *EnsoulSession) Version() (string, error) {
	return _Ensoul.Contract.Version(&_Ensoul.CallOpts)
}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() pure returns(string)
func (_Ensoul *EnsoulCallerSession) Version() (string, error) {
	return _Ensoul.Contract.Version(&_Ensoul.CallOpts)
}

// AddOrgAdmin is a paid mutator transaction binding the contract method 0xfdab306e.
//
// Solidity: function addOrgAdmin(address admin) returns()
func (_Ensoul *EnsoulTransactor) AddOrgAdmin(opts *bind.TransactOpts, admin common.Address) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "addOrgAdmin", admin)
}

// AddOrgAdmin is a paid mutator transaction binding the contract method 0xfdab306e.
//
// Solidity: function addOrgAdmin(address admin) returns()
func (_Ensoul *EnsoulSession) AddOrgAdmin(admin common.Address) (*types.Transaction, error) {
	return _Ensoul.Contract.AddOrgAdmin(&_Ensoul.TransactOpts, admin)
}

// AddOrgAdmin is a paid mutator transaction binding the contract method 0xfdab306e.
//
// Solidity: function addOrgAdmin(address admin) returns()
func (_Ensoul *EnsoulTransactorSession) AddOrgAdmin(admin common.Address) (*types.Transaction, error) {
	return _Ensoul.Contract.AddOrgAdmin(&_Ensoul.TransactOpts, admin)
}

// Allow is a paid mutator transaction binding the contract method 0x6c6f31f2.
//
// Solidity: function allow(address to, uint256 tokenId) returns()
func (_Ensoul *EnsoulTransactor) Allow(opts *bind.TransactOpts, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "allow", to, tokenId)
}

// Allow is a paid mutator transaction binding the contract method 0x6c6f31f2.
//
// Solidity: function allow(address to, uint256 tokenId) returns()
func (_Ensoul *EnsoulSession) Allow(to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.Allow(&_Ensoul.TransactOpts, to, tokenId)
}

// Allow is a paid mutator transaction binding the contract method 0x6c6f31f2.
//
// Solidity: function allow(address to, uint256 tokenId) returns()
func (_Ensoul *EnsoulTransactorSession) Allow(to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.Allow(&_Ensoul.TransactOpts, to, tokenId)
}

// AllowBatch is a paid mutator transaction binding the contract method 0xf22b975e.
//
// Solidity: function allowBatch(address[] toList, uint256[] tokenIdList) returns()
func (_Ensoul *EnsoulTransactor) AllowBatch(opts *bind.TransactOpts, toList []common.Address, tokenIdList []*big.Int) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "allowBatch", toList, tokenIdList)
}

// AllowBatch is a paid mutator transaction binding the contract method 0xf22b975e.
//
// Solidity: function allowBatch(address[] toList, uint256[] tokenIdList) returns()
func (_Ensoul *EnsoulSession) AllowBatch(toList []common.Address, tokenIdList []*big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.AllowBatch(&_Ensoul.TransactOpts, toList, tokenIdList)
}

// AllowBatch is a paid mutator transaction binding the contract method 0xf22b975e.
//
// Solidity: function allowBatch(address[] toList, uint256[] tokenIdList) returns()
func (_Ensoul *EnsoulTransactorSession) AllowBatch(toList []common.Address, tokenIdList []*big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.AllowBatch(&_Ensoul.TransactOpts, toList, tokenIdList)
}

// Burn is a paid mutator transaction binding the contract method 0xb390c0ab.
//
// Solidity: function burn(uint256 id, uint256 amount) returns()
func (_Ensoul *EnsoulTransactor) Burn(opts *bind.TransactOpts, id *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "burn", id, amount)
}

// Burn is a paid mutator transaction binding the contract method 0xb390c0ab.
//
// Solidity: function burn(uint256 id, uint256 amount) returns()
func (_Ensoul *EnsoulSession) Burn(id *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.Burn(&_Ensoul.TransactOpts, id, amount)
}

// Burn is a paid mutator transaction binding the contract method 0xb390c0ab.
//
// Solidity: function burn(uint256 id, uint256 amount) returns()
func (_Ensoul *EnsoulTransactorSession) Burn(id *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.Burn(&_Ensoul.TransactOpts, id, amount)
}

// BurnBatch is a paid mutator transaction binding the contract method 0x83ca4b6f.
//
// Solidity: function burnBatch(uint256[] ids, uint256[] amounts) returns()
func (_Ensoul *EnsoulTransactor) BurnBatch(opts *bind.TransactOpts, ids []*big.Int, amounts []*big.Int) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "burnBatch", ids, amounts)
}

// BurnBatch is a paid mutator transaction binding the contract method 0x83ca4b6f.
//
// Solidity: function burnBatch(uint256[] ids, uint256[] amounts) returns()
func (_Ensoul *EnsoulSession) BurnBatch(ids []*big.Int, amounts []*big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.BurnBatch(&_Ensoul.TransactOpts, ids, amounts)
}

// BurnBatch is a paid mutator transaction binding the contract method 0x83ca4b6f.
//
// Solidity: function burnBatch(uint256[] ids, uint256[] amounts) returns()
func (_Ensoul *EnsoulTransactorSession) BurnBatch(ids []*big.Int, amounts []*big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.BurnBatch(&_Ensoul.TransactOpts, ids, amounts)
}

// Initialize is a paid mutator transaction binding the contract method 0x5f1e6f6d.
//
// Solidity: function initialize(address _owner, string _tokenURI, string _contractURI, string _name) returns()
func (_Ensoul *EnsoulTransactor) Initialize(opts *bind.TransactOpts, _owner common.Address, _tokenURI string, _contractURI string, _name string) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "initialize", _owner, _tokenURI, _contractURI, _name)
}

// Initialize is a paid mutator transaction binding the contract method 0x5f1e6f6d.
//
// Solidity: function initialize(address _owner, string _tokenURI, string _contractURI, string _name) returns()
func (_Ensoul *EnsoulSession) Initialize(_owner common.Address, _tokenURI string, _contractURI string, _name string) (*types.Transaction, error) {
	return _Ensoul.Contract.Initialize(&_Ensoul.TransactOpts, _owner, _tokenURI, _contractURI, _name)
}

// Initialize is a paid mutator transaction binding the contract method 0x5f1e6f6d.
//
// Solidity: function initialize(address _owner, string _tokenURI, string _contractURI, string _name) returns()
func (_Ensoul *EnsoulTransactorSession) Initialize(_owner common.Address, _tokenURI string, _contractURI string, _name string) (*types.Transaction, error) {
	return _Ensoul.Contract.Initialize(&_Ensoul.TransactOpts, _owner, _tokenURI, _contractURI, _name)
}

// Mint is a paid mutator transaction binding the contract method 0x156e29f6.
//
// Solidity: function mint(address account, uint256 id, uint256 amount) returns()
func (_Ensoul *EnsoulTransactor) Mint(opts *bind.TransactOpts, account common.Address, id *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "mint", account, id, amount)
}

// Mint is a paid mutator transaction binding the contract method 0x156e29f6.
//
// Solidity: function mint(address account, uint256 id, uint256 amount) returns()
func (_Ensoul *EnsoulSession) Mint(account common.Address, id *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.Mint(&_Ensoul.TransactOpts, account, id, amount)
}

// Mint is a paid mutator transaction binding the contract method 0x156e29f6.
//
// Solidity: function mint(address account, uint256 id, uint256 amount) returns()
func (_Ensoul *EnsoulTransactorSession) Mint(account common.Address, id *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.Mint(&_Ensoul.TransactOpts, account, id, amount)
}

// MintBySignature is a paid mutator transaction binding the contract method 0x13b4e6a2.
//
// Solidity: function mintBySignature(address to, uint256 tokenId, uint256 amount, uint256 expiration, uint8 v, bytes32 r, bytes32 s) returns()
func (_Ensoul *EnsoulTransactor) MintBySignature(opts *bind.TransactOpts, to common.Address, tokenId *big.Int, amount *big.Int, expiration *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "mintBySignature", to, tokenId, amount, expiration, v, r, s)
}

// MintBySignature is a paid mutator transaction binding the contract method 0x13b4e6a2.
//
// Solidity: function mintBySignature(address to, uint256 tokenId, uint256 amount, uint256 expiration, uint8 v, bytes32 r, bytes32 s) returns()
func (_Ensoul *EnsoulSession) MintBySignature(to common.Address, tokenId *big.Int, amount *big.Int, expiration *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _Ensoul.Contract.MintBySignature(&_Ensoul.TransactOpts, to, tokenId, amount, expiration, v, r, s)
}

// MintBySignature is a paid mutator transaction binding the contract method 0x13b4e6a2.
//
// Solidity: function mintBySignature(address to, uint256 tokenId, uint256 amount, uint256 expiration, uint8 v, bytes32 r, bytes32 s) returns()
func (_Ensoul *EnsoulTransactorSession) MintBySignature(to common.Address, tokenId *big.Int, amount *big.Int, expiration *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _Ensoul.Contract.MintBySignature(&_Ensoul.TransactOpts, to, tokenId, amount, expiration, v, r, s)
}

// MintToBatchAddress is a paid mutator transaction binding the contract method 0x1b99a310.
//
// Solidity: function mintToBatchAddress(address[] toList, uint256 tokenId, uint256 amount) returns()
func (_Ensoul *EnsoulTransactor) MintToBatchAddress(opts *bind.TransactOpts, toList []common.Address, tokenId *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "mintToBatchAddress", toList, tokenId, amount)
}

// MintToBatchAddress is a paid mutator transaction binding the contract method 0x1b99a310.
//
// Solidity: function mintToBatchAddress(address[] toList, uint256 tokenId, uint256 amount) returns()
func (_Ensoul *EnsoulSession) MintToBatchAddress(toList []common.Address, tokenId *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.MintToBatchAddress(&_Ensoul.TransactOpts, toList, tokenId, amount)
}

// MintToBatchAddress is a paid mutator transaction binding the contract method 0x1b99a310.
//
// Solidity: function mintToBatchAddress(address[] toList, uint256 tokenId, uint256 amount) returns()
func (_Ensoul *EnsoulTransactorSession) MintToBatchAddress(toList []common.Address, tokenId *big.Int, amount *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.MintToBatchAddress(&_Ensoul.TransactOpts, toList, tokenId, amount)
}

// MintToBatchAddressBySignature is a paid mutator transaction binding the contract method 0xf2485310.
//
// Solidity: function mintToBatchAddressBySignature(address[] toList, uint256 tokenId, uint256 amount, uint256 expiration, uint8 v, bytes32 r, bytes32 s) returns()
func (_Ensoul *EnsoulTransactor) MintToBatchAddressBySignature(opts *bind.TransactOpts, toList []common.Address, tokenId *big.Int, amount *big.Int, expiration *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "mintToBatchAddressBySignature", toList, tokenId, amount, expiration, v, r, s)
}

// MintToBatchAddressBySignature is a paid mutator transaction binding the contract method 0xf2485310.
//
// Solidity: function mintToBatchAddressBySignature(address[] toList, uint256 tokenId, uint256 amount, uint256 expiration, uint8 v, bytes32 r, bytes32 s) returns()
func (_Ensoul *EnsoulSession) MintToBatchAddressBySignature(toList []common.Address, tokenId *big.Int, amount *big.Int, expiration *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _Ensoul.Contract.MintToBatchAddressBySignature(&_Ensoul.TransactOpts, toList, tokenId, amount, expiration, v, r, s)
}

// MintToBatchAddressBySignature is a paid mutator transaction binding the contract method 0xf2485310.
//
// Solidity: function mintToBatchAddressBySignature(address[] toList, uint256 tokenId, uint256 amount, uint256 expiration, uint8 v, bytes32 r, bytes32 s) returns()
func (_Ensoul *EnsoulTransactorSession) MintToBatchAddressBySignature(toList []common.Address, tokenId *big.Int, amount *big.Int, expiration *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _Ensoul.Contract.MintToBatchAddressBySignature(&_Ensoul.TransactOpts, toList, tokenId, amount, expiration, v, r, s)
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_Ensoul *EnsoulTransactor) Pause(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "pause")
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_Ensoul *EnsoulSession) Pause() (*types.Transaction, error) {
	return _Ensoul.Contract.Pause(&_Ensoul.TransactOpts)
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_Ensoul *EnsoulTransactorSession) Pause() (*types.Transaction, error) {
	return _Ensoul.Contract.Pause(&_Ensoul.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Ensoul *EnsoulTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Ensoul *EnsoulSession) RenounceOwnership() (*types.Transaction, error) {
	return _Ensoul.Contract.RenounceOwnership(&_Ensoul.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Ensoul *EnsoulTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _Ensoul.Contract.RenounceOwnership(&_Ensoul.TransactOpts)
}

// RevokeAllow is a paid mutator transaction binding the contract method 0xcabaed72.
//
// Solidity: function revokeAllow(address to, uint256 tokenId) returns()
func (_Ensoul *EnsoulTransactor) RevokeAllow(opts *bind.TransactOpts, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "revokeAllow", to, tokenId)
}

// RevokeAllow is a paid mutator transaction binding the contract method 0xcabaed72.
//
// Solidity: function revokeAllow(address to, uint256 tokenId) returns()
func (_Ensoul *EnsoulSession) RevokeAllow(to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.RevokeAllow(&_Ensoul.TransactOpts, to, tokenId)
}

// RevokeAllow is a paid mutator transaction binding the contract method 0xcabaed72.
//
// Solidity: function revokeAllow(address to, uint256 tokenId) returns()
func (_Ensoul *EnsoulTransactorSession) RevokeAllow(to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.RevokeAllow(&_Ensoul.TransactOpts, to, tokenId)
}

// RevokeAllowBatch is a paid mutator transaction binding the contract method 0x23c854ba.
//
// Solidity: function revokeAllowBatch(address[] toList, uint256[] tokenIdList) returns()
func (_Ensoul *EnsoulTransactor) RevokeAllowBatch(opts *bind.TransactOpts, toList []common.Address, tokenIdList []*big.Int) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "revokeAllowBatch", toList, tokenIdList)
}

// RevokeAllowBatch is a paid mutator transaction binding the contract method 0x23c854ba.
//
// Solidity: function revokeAllowBatch(address[] toList, uint256[] tokenIdList) returns()
func (_Ensoul *EnsoulSession) RevokeAllowBatch(toList []common.Address, tokenIdList []*big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.RevokeAllowBatch(&_Ensoul.TransactOpts, toList, tokenIdList)
}

// RevokeAllowBatch is a paid mutator transaction binding the contract method 0x23c854ba.
//
// Solidity: function revokeAllowBatch(address[] toList, uint256[] tokenIdList) returns()
func (_Ensoul *EnsoulTransactorSession) RevokeAllowBatch(toList []common.Address, tokenIdList []*big.Int) (*types.Transaction, error) {
	return _Ensoul.Contract.RevokeAllowBatch(&_Ensoul.TransactOpts, toList, tokenIdList)
}

// RevokeOrgAdmin is a paid mutator transaction binding the contract method 0xeb918fde.
//
// Solidity: function revokeOrgAdmin(address admin) returns()
func (_Ensoul *EnsoulTransactor) RevokeOrgAdmin(opts *bind.TransactOpts, admin common.Address) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "revokeOrgAdmin", admin)
}

// RevokeOrgAdmin is a paid mutator transaction binding the contract method 0xeb918fde.
//
// Solidity: function revokeOrgAdmin(address admin) returns()
func (_Ensoul *EnsoulSession) RevokeOrgAdmin(admin common.Address) (*types.Transaction, error) {
	return _Ensoul.Contract.RevokeOrgAdmin(&_Ensoul.TransactOpts, admin)
}

// RevokeOrgAdmin is a paid mutator transaction binding the contract method 0xeb918fde.
//
// Solidity: function revokeOrgAdmin(address admin) returns()
func (_Ensoul *EnsoulTransactorSession) RevokeOrgAdmin(admin common.Address) (*types.Transaction, error) {
	return _Ensoul.Contract.RevokeOrgAdmin(&_Ensoul.TransactOpts, admin)
}

// SafeBatchTransferFrom is a paid mutator transaction binding the contract method 0x2eb2c2d6.
//
// Solidity: function safeBatchTransferFrom(address , address , uint256[] , uint256[] , bytes ) returns()
func (_Ensoul *EnsoulTransactor) SafeBatchTransferFrom(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 []*big.Int, arg3 []*big.Int, arg4 []byte) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "safeBatchTransferFrom", arg0, arg1, arg2, arg3, arg4)
}

// SafeBatchTransferFrom is a paid mutator transaction binding the contract method 0x2eb2c2d6.
//
// Solidity: function safeBatchTransferFrom(address , address , uint256[] , uint256[] , bytes ) returns()
func (_Ensoul *EnsoulSession) SafeBatchTransferFrom(arg0 common.Address, arg1 common.Address, arg2 []*big.Int, arg3 []*big.Int, arg4 []byte) (*types.Transaction, error) {
	return _Ensoul.Contract.SafeBatchTransferFrom(&_Ensoul.TransactOpts, arg0, arg1, arg2, arg3, arg4)
}

// SafeBatchTransferFrom is a paid mutator transaction binding the contract method 0x2eb2c2d6.
//
// Solidity: function safeBatchTransferFrom(address , address , uint256[] , uint256[] , bytes ) returns()
func (_Ensoul *EnsoulTransactorSession) SafeBatchTransferFrom(arg0 common.Address, arg1 common.Address, arg2 []*big.Int, arg3 []*big.Int, arg4 []byte) (*types.Transaction, error) {
	return _Ensoul.Contract.SafeBatchTransferFrom(&_Ensoul.TransactOpts, arg0, arg1, arg2, arg3, arg4)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0xf242432a.
//
// Solidity: function safeTransferFrom(address , address , uint256 , uint256 , bytes ) returns()
func (_Ensoul *EnsoulTransactor) SafeTransferFrom(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 *big.Int, arg4 []byte) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "safeTransferFrom", arg0, arg1, arg2, arg3, arg4)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0xf242432a.
//
// Solidity: function safeTransferFrom(address , address , uint256 , uint256 , bytes ) returns()
func (_Ensoul *EnsoulSession) SafeTransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 *big.Int, arg4 []byte) (*types.Transaction, error) {
	return _Ensoul.Contract.SafeTransferFrom(&_Ensoul.TransactOpts, arg0, arg1, arg2, arg3, arg4)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0xf242432a.
//
// Solidity: function safeTransferFrom(address , address , uint256 , uint256 , bytes ) returns()
func (_Ensoul *EnsoulTransactorSession) SafeTransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 *big.Int, arg4 []byte) (*types.Transaction, error) {
	return _Ensoul.Contract.SafeTransferFrom(&_Ensoul.TransactOpts, arg0, arg1, arg2, arg3, arg4)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_Ensoul *EnsoulTransactor) SetApprovalForAll(opts *bind.TransactOpts, arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "setApprovalForAll", arg0, arg1)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_Ensoul *EnsoulSession) SetApprovalForAll(arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _Ensoul.Contract.SetApprovalForAll(&_Ensoul.TransactOpts, arg0, arg1)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_Ensoul *EnsoulTransactorSession) SetApprovalForAll(arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _Ensoul.Contract.SetApprovalForAll(&_Ensoul.TransactOpts, arg0, arg1)
}

// SetContractURI is a paid mutator transaction binding the contract method 0x938e3d7b.
//
// Solidity: function setContractURI(string contractURI_) returns()
func (_Ensoul *EnsoulTransactor) SetContractURI(opts *bind.TransactOpts, contractURI_ string) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "setContractURI", contractURI_)
}

// SetContractURI is a paid mutator transaction binding the contract method 0x938e3d7b.
//
// Solidity: function setContractURI(string contractURI_) returns()
func (_Ensoul *EnsoulSession) SetContractURI(contractURI_ string) (*types.Transaction, error) {
	return _Ensoul.Contract.SetContractURI(&_Ensoul.TransactOpts, contractURI_)
}

// SetContractURI is a paid mutator transaction binding the contract method 0x938e3d7b.
//
// Solidity: function setContractURI(string contractURI_) returns()
func (_Ensoul *EnsoulTransactorSession) SetContractURI(contractURI_ string) (*types.Transaction, error) {
	return _Ensoul.Contract.SetContractURI(&_Ensoul.TransactOpts, contractURI_)
}

// SetName is a paid mutator transaction binding the contract method 0xc47f0027.
//
// Solidity: function setName(string newName) returns()
func (_Ensoul *EnsoulTransactor) SetName(opts *bind.TransactOpts, newName string) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "setName", newName)
}

// SetName is a paid mutator transaction binding the contract method 0xc47f0027.
//
// Solidity: function setName(string newName) returns()
func (_Ensoul *EnsoulSession) SetName(newName string) (*types.Transaction, error) {
	return _Ensoul.Contract.SetName(&_Ensoul.TransactOpts, newName)
}

// SetName is a paid mutator transaction binding the contract method 0xc47f0027.
//
// Solidity: function setName(string newName) returns()
func (_Ensoul *EnsoulTransactorSession) SetName(newName string) (*types.Transaction, error) {
	return _Ensoul.Contract.SetName(&_Ensoul.TransactOpts, newName)
}

// SetURI is a paid mutator transaction binding the contract method 0x02fe5305.
//
// Solidity: function setURI(string newuri) returns()
func (_Ensoul *EnsoulTransactor) SetURI(opts *bind.TransactOpts, newuri string) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "setURI", newuri)
}

// SetURI is a paid mutator transaction binding the contract method 0x02fe5305.
//
// Solidity: function setURI(string newuri) returns()
func (_Ensoul *EnsoulSession) SetURI(newuri string) (*types.Transaction, error) {
	return _Ensoul.Contract.SetURI(&_Ensoul.TransactOpts, newuri)
}

// SetURI is a paid mutator transaction binding the contract method 0x02fe5305.
//
// Solidity: function setURI(string newuri) returns()
func (_Ensoul *EnsoulTransactorSession) SetURI(newuri string) (*types.Transaction, error) {
	return _Ensoul.Contract.SetURI(&_Ensoul.TransactOpts, newuri)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Ensoul *EnsoulTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Ensoul *EnsoulSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Ensoul.Contract.TransferOwnership(&_Ensoul.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Ensoul *EnsoulTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Ensoul.Contract.TransferOwnership(&_Ensoul.TransactOpts, newOwner)
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_Ensoul *EnsoulTransactor) Unpause(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Ensoul.contract.Transact(opts, "unpause")
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_Ensoul *EnsoulSession) Unpause() (*types.Transaction, error) {
	return _Ensoul.Contract.Unpause(&_Ensoul.TransactOpts)
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_Ensoul *EnsoulTransactorSession) Unpause() (*types.Transaction, error) {
	return _Ensoul.Contract.Unpause(&_Ensoul.TransactOpts)
}

// EnsoulAddOrgAdminIterator is returned from FilterAddOrgAdmin and is used to iterate over the raw logs and unpacked data for AddOrgAdmin events raised by the Ensoul contract.
type EnsoulAddOrgAdminIterator struct {
	Event *EnsoulAddOrgAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulAddOrgAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulAddOrgAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulAddOrgAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulAddOrgAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulAddOrgAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulAddOrgAdmin represents a AddOrgAdmin event raised by the Ensoul contract.
type EnsoulAddOrgAdmin struct {
	Owner common.Address
	Admin common.Address
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterAddOrgAdmin is a free log retrieval operation binding the contract event 0x0946149fadb373d97c89d42bf92bd205ec9e2d04eead514b56103b6b37e38e8c.
//
// Solidity: event AddOrgAdmin(address indexed owner, address admin)
func (_Ensoul *EnsoulFilterer) FilterAddOrgAdmin(opts *bind.FilterOpts, owner []common.Address) (*EnsoulAddOrgAdminIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "AddOrgAdmin", ownerRule)
	if err != nil {
		return nil, err
	}
	return &EnsoulAddOrgAdminIterator{contract: _Ensoul.contract, event: "AddOrgAdmin", logs: logs, sub: sub}, nil
}

// WatchAddOrgAdmin is a free log subscription operation binding the contract event 0x0946149fadb373d97c89d42bf92bd205ec9e2d04eead514b56103b6b37e38e8c.
//
// Solidity: event AddOrgAdmin(address indexed owner, address admin)
func (_Ensoul *EnsoulFilterer) WatchAddOrgAdmin(opts *bind.WatchOpts, sink chan<- *EnsoulAddOrgAdmin, owner []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "AddOrgAdmin", ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulAddOrgAdmin)
				if err := _Ensoul.contract.UnpackLog(event, "AddOrgAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAddOrgAdmin is a log parse operation binding the contract event 0x0946149fadb373d97c89d42bf92bd205ec9e2d04eead514b56103b6b37e38e8c.
//
// Solidity: event AddOrgAdmin(address indexed owner, address admin)
func (_Ensoul *EnsoulFilterer) ParseAddOrgAdmin(log types.Log) (*EnsoulAddOrgAdmin, error) {
	event := new(EnsoulAddOrgAdmin)
	if err := _Ensoul.contract.UnpackLog(event, "AddOrgAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulAllowIterator is returned from FilterAllow and is used to iterate over the raw logs and unpacked data for Allow events raised by the Ensoul contract.
type EnsoulAllowIterator struct {
	Event *EnsoulAllow // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulAllowIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulAllow)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulAllow)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulAllowIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulAllowIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulAllow represents a Allow event raised by the Ensoul contract.
type EnsoulAllow struct {
	From    common.Address
	To      common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterAllow is a free log retrieval operation binding the contract event 0x887d9984e762f92db7d8e62204192cc636432b470e181f49d117b7e8ac8c0505.
//
// Solidity: event Allow(address from, address to, uint256 tokenId)
func (_Ensoul *EnsoulFilterer) FilterAllow(opts *bind.FilterOpts) (*EnsoulAllowIterator, error) {

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "Allow")
	if err != nil {
		return nil, err
	}
	return &EnsoulAllowIterator{contract: _Ensoul.contract, event: "Allow", logs: logs, sub: sub}, nil
}

// WatchAllow is a free log subscription operation binding the contract event 0x887d9984e762f92db7d8e62204192cc636432b470e181f49d117b7e8ac8c0505.
//
// Solidity: event Allow(address from, address to, uint256 tokenId)
func (_Ensoul *EnsoulFilterer) WatchAllow(opts *bind.WatchOpts, sink chan<- *EnsoulAllow) (event.Subscription, error) {

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "Allow")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulAllow)
				if err := _Ensoul.contract.UnpackLog(event, "Allow", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAllow is a log parse operation binding the contract event 0x887d9984e762f92db7d8e62204192cc636432b470e181f49d117b7e8ac8c0505.
//
// Solidity: event Allow(address from, address to, uint256 tokenId)
func (_Ensoul *EnsoulFilterer) ParseAllow(log types.Log) (*EnsoulAllow, error) {
	event := new(EnsoulAllow)
	if err := _Ensoul.contract.UnpackLog(event, "Allow", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulApprovalForAllIterator is returned from FilterApprovalForAll and is used to iterate over the raw logs and unpacked data for ApprovalForAll events raised by the Ensoul contract.
type EnsoulApprovalForAllIterator struct {
	Event *EnsoulApprovalForAll // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulApprovalForAllIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulApprovalForAll)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulApprovalForAll)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulApprovalForAllIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulApprovalForAllIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulApprovalForAll represents a ApprovalForAll event raised by the Ensoul contract.
type EnsoulApprovalForAll struct {
	Account  common.Address
	Operator common.Address
	Approved bool
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApprovalForAll is a free log retrieval operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed account, address indexed operator, bool approved)
func (_Ensoul *EnsoulFilterer) FilterApprovalForAll(opts *bind.FilterOpts, account []common.Address, operator []common.Address) (*EnsoulApprovalForAllIterator, error) {

	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "ApprovalForAll", accountRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return &EnsoulApprovalForAllIterator{contract: _Ensoul.contract, event: "ApprovalForAll", logs: logs, sub: sub}, nil
}

// WatchApprovalForAll is a free log subscription operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed account, address indexed operator, bool approved)
func (_Ensoul *EnsoulFilterer) WatchApprovalForAll(opts *bind.WatchOpts, sink chan<- *EnsoulApprovalForAll, account []common.Address, operator []common.Address) (event.Subscription, error) {

	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "ApprovalForAll", accountRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulApprovalForAll)
				if err := _Ensoul.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApprovalForAll is a log parse operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed account, address indexed operator, bool approved)
func (_Ensoul *EnsoulFilterer) ParseApprovalForAll(log types.Log) (*EnsoulApprovalForAll, error) {
	event := new(EnsoulApprovalForAll)
	if err := _Ensoul.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the Ensoul contract.
type EnsoulOwnershipTransferredIterator struct {
	Event *EnsoulOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulOwnershipTransferred represents a OwnershipTransferred event raised by the Ensoul contract.
type EnsoulOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Ensoul *EnsoulFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*EnsoulOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &EnsoulOwnershipTransferredIterator{contract: _Ensoul.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Ensoul *EnsoulFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *EnsoulOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulOwnershipTransferred)
				if err := _Ensoul.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Ensoul *EnsoulFilterer) ParseOwnershipTransferred(log types.Log) (*EnsoulOwnershipTransferred, error) {
	event := new(EnsoulOwnershipTransferred)
	if err := _Ensoul.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulPausedIterator is returned from FilterPaused and is used to iterate over the raw logs and unpacked data for Paused events raised by the Ensoul contract.
type EnsoulPausedIterator struct {
	Event *EnsoulPaused // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulPausedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulPaused)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulPaused)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulPausedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulPausedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulPaused represents a Paused event raised by the Ensoul contract.
type EnsoulPaused struct {
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterPaused is a free log retrieval operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_Ensoul *EnsoulFilterer) FilterPaused(opts *bind.FilterOpts) (*EnsoulPausedIterator, error) {

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "Paused")
	if err != nil {
		return nil, err
	}
	return &EnsoulPausedIterator{contract: _Ensoul.contract, event: "Paused", logs: logs, sub: sub}, nil
}

// WatchPaused is a free log subscription operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_Ensoul *EnsoulFilterer) WatchPaused(opts *bind.WatchOpts, sink chan<- *EnsoulPaused) (event.Subscription, error) {

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "Paused")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulPaused)
				if err := _Ensoul.contract.UnpackLog(event, "Paused", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParsePaused is a log parse operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_Ensoul *EnsoulFilterer) ParsePaused(log types.Log) (*EnsoulPaused, error) {
	event := new(EnsoulPaused)
	if err := _Ensoul.contract.UnpackLog(event, "Paused", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulRemoveOrgAdminIterator is returned from FilterRemoveOrgAdmin and is used to iterate over the raw logs and unpacked data for RemoveOrgAdmin events raised by the Ensoul contract.
type EnsoulRemoveOrgAdminIterator struct {
	Event *EnsoulRemoveOrgAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulRemoveOrgAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulRemoveOrgAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulRemoveOrgAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulRemoveOrgAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulRemoveOrgAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulRemoveOrgAdmin represents a RemoveOrgAdmin event raised by the Ensoul contract.
type EnsoulRemoveOrgAdmin struct {
	Owner common.Address
	Admin common.Address
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterRemoveOrgAdmin is a free log retrieval operation binding the contract event 0x8acadb026d2aa97ceec2fb8432e6f98ad2702d6e0a97796a25a4debf07eada26.
//
// Solidity: event RemoveOrgAdmin(address indexed owner, address admin)
func (_Ensoul *EnsoulFilterer) FilterRemoveOrgAdmin(opts *bind.FilterOpts, owner []common.Address) (*EnsoulRemoveOrgAdminIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "RemoveOrgAdmin", ownerRule)
	if err != nil {
		return nil, err
	}
	return &EnsoulRemoveOrgAdminIterator{contract: _Ensoul.contract, event: "RemoveOrgAdmin", logs: logs, sub: sub}, nil
}

// WatchRemoveOrgAdmin is a free log subscription operation binding the contract event 0x8acadb026d2aa97ceec2fb8432e6f98ad2702d6e0a97796a25a4debf07eada26.
//
// Solidity: event RemoveOrgAdmin(address indexed owner, address admin)
func (_Ensoul *EnsoulFilterer) WatchRemoveOrgAdmin(opts *bind.WatchOpts, sink chan<- *EnsoulRemoveOrgAdmin, owner []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "RemoveOrgAdmin", ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulRemoveOrgAdmin)
				if err := _Ensoul.contract.UnpackLog(event, "RemoveOrgAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRemoveOrgAdmin is a log parse operation binding the contract event 0x8acadb026d2aa97ceec2fb8432e6f98ad2702d6e0a97796a25a4debf07eada26.
//
// Solidity: event RemoveOrgAdmin(address indexed owner, address admin)
func (_Ensoul *EnsoulFilterer) ParseRemoveOrgAdmin(log types.Log) (*EnsoulRemoveOrgAdmin, error) {
	event := new(EnsoulRemoveOrgAdmin)
	if err := _Ensoul.contract.UnpackLog(event, "RemoveOrgAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulRevokeAllowIterator is returned from FilterRevokeAllow and is used to iterate over the raw logs and unpacked data for RevokeAllow events raised by the Ensoul contract.
type EnsoulRevokeAllowIterator struct {
	Event *EnsoulRevokeAllow // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulRevokeAllowIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulRevokeAllow)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulRevokeAllow)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulRevokeAllowIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulRevokeAllowIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulRevokeAllow represents a RevokeAllow event raised by the Ensoul contract.
type EnsoulRevokeAllow struct {
	From    common.Address
	To      common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterRevokeAllow is a free log retrieval operation binding the contract event 0xf8a9f575a23431b5f500265d7b6ece4d082e77854c4e6f656fc26a5365a47212.
//
// Solidity: event RevokeAllow(address from, address to, uint256 tokenId)
func (_Ensoul *EnsoulFilterer) FilterRevokeAllow(opts *bind.FilterOpts) (*EnsoulRevokeAllowIterator, error) {

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "RevokeAllow")
	if err != nil {
		return nil, err
	}
	return &EnsoulRevokeAllowIterator{contract: _Ensoul.contract, event: "RevokeAllow", logs: logs, sub: sub}, nil
}

// WatchRevokeAllow is a free log subscription operation binding the contract event 0xf8a9f575a23431b5f500265d7b6ece4d082e77854c4e6f656fc26a5365a47212.
//
// Solidity: event RevokeAllow(address from, address to, uint256 tokenId)
func (_Ensoul *EnsoulFilterer) WatchRevokeAllow(opts *bind.WatchOpts, sink chan<- *EnsoulRevokeAllow) (event.Subscription, error) {

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "RevokeAllow")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulRevokeAllow)
				if err := _Ensoul.contract.UnpackLog(event, "RevokeAllow", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRevokeAllow is a log parse operation binding the contract event 0xf8a9f575a23431b5f500265d7b6ece4d082e77854c4e6f656fc26a5365a47212.
//
// Solidity: event RevokeAllow(address from, address to, uint256 tokenId)
func (_Ensoul *EnsoulFilterer) ParseRevokeAllow(log types.Log) (*EnsoulRevokeAllow, error) {
	event := new(EnsoulRevokeAllow)
	if err := _Ensoul.contract.UnpackLog(event, "RevokeAllow", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulTransferBatchIterator is returned from FilterTransferBatch and is used to iterate over the raw logs and unpacked data for TransferBatch events raised by the Ensoul contract.
type EnsoulTransferBatchIterator struct {
	Event *EnsoulTransferBatch // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulTransferBatchIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulTransferBatch)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulTransferBatch)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulTransferBatchIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulTransferBatchIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulTransferBatch represents a TransferBatch event raised by the Ensoul contract.
type EnsoulTransferBatch struct {
	Operator common.Address
	From     common.Address
	To       common.Address
	Ids      []*big.Int
	Values   []*big.Int
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterTransferBatch is a free log retrieval operation binding the contract event 0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb.
//
// Solidity: event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)
func (_Ensoul *EnsoulFilterer) FilterTransferBatch(opts *bind.FilterOpts, operator []common.Address, from []common.Address, to []common.Address) (*EnsoulTransferBatchIterator, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "TransferBatch", operatorRule, fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return &EnsoulTransferBatchIterator{contract: _Ensoul.contract, event: "TransferBatch", logs: logs, sub: sub}, nil
}

// WatchTransferBatch is a free log subscription operation binding the contract event 0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb.
//
// Solidity: event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)
func (_Ensoul *EnsoulFilterer) WatchTransferBatch(opts *bind.WatchOpts, sink chan<- *EnsoulTransferBatch, operator []common.Address, from []common.Address, to []common.Address) (event.Subscription, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "TransferBatch", operatorRule, fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulTransferBatch)
				if err := _Ensoul.contract.UnpackLog(event, "TransferBatch", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransferBatch is a log parse operation binding the contract event 0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb.
//
// Solidity: event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)
func (_Ensoul *EnsoulFilterer) ParseTransferBatch(log types.Log) (*EnsoulTransferBatch, error) {
	event := new(EnsoulTransferBatch)
	if err := _Ensoul.contract.UnpackLog(event, "TransferBatch", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulTransferSingleIterator is returned from FilterTransferSingle and is used to iterate over the raw logs and unpacked data for TransferSingle events raised by the Ensoul contract.
type EnsoulTransferSingleIterator struct {
	Event *EnsoulTransferSingle // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulTransferSingleIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulTransferSingle)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulTransferSingle)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulTransferSingleIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulTransferSingleIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulTransferSingle represents a TransferSingle event raised by the Ensoul contract.
type EnsoulTransferSingle struct {
	Operator common.Address
	From     common.Address
	To       common.Address
	Id       *big.Int
	Value    *big.Int
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterTransferSingle is a free log retrieval operation binding the contract event 0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62.
//
// Solidity: event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)
func (_Ensoul *EnsoulFilterer) FilterTransferSingle(opts *bind.FilterOpts, operator []common.Address, from []common.Address, to []common.Address) (*EnsoulTransferSingleIterator, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "TransferSingle", operatorRule, fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return &EnsoulTransferSingleIterator{contract: _Ensoul.contract, event: "TransferSingle", logs: logs, sub: sub}, nil
}

// WatchTransferSingle is a free log subscription operation binding the contract event 0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62.
//
// Solidity: event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)
func (_Ensoul *EnsoulFilterer) WatchTransferSingle(opts *bind.WatchOpts, sink chan<- *EnsoulTransferSingle, operator []common.Address, from []common.Address, to []common.Address) (event.Subscription, error) {

	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}
	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "TransferSingle", operatorRule, fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulTransferSingle)
				if err := _Ensoul.contract.UnpackLog(event, "TransferSingle", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransferSingle is a log parse operation binding the contract event 0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62.
//
// Solidity: event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)
func (_Ensoul *EnsoulFilterer) ParseTransferSingle(log types.Log) (*EnsoulTransferSingle, error) {
	event := new(EnsoulTransferSingle)
	if err := _Ensoul.contract.UnpackLog(event, "TransferSingle", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulURIIterator is returned from FilterURI and is used to iterate over the raw logs and unpacked data for URI events raised by the Ensoul contract.
type EnsoulURIIterator struct {
	Event *EnsoulURI // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulURIIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulURI)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulURI)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulURIIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulURIIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulURI represents a URI event raised by the Ensoul contract.
type EnsoulURI struct {
	Value string
	Id    *big.Int
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterURI is a free log retrieval operation binding the contract event 0x6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b.
//
// Solidity: event URI(string value, uint256 indexed id)
func (_Ensoul *EnsoulFilterer) FilterURI(opts *bind.FilterOpts, id []*big.Int) (*EnsoulURIIterator, error) {

	var idRule []interface{}
	for _, idItem := range id {
		idRule = append(idRule, idItem)
	}

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "URI", idRule)
	if err != nil {
		return nil, err
	}
	return &EnsoulURIIterator{contract: _Ensoul.contract, event: "URI", logs: logs, sub: sub}, nil
}

// WatchURI is a free log subscription operation binding the contract event 0x6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b.
//
// Solidity: event URI(string value, uint256 indexed id)
func (_Ensoul *EnsoulFilterer) WatchURI(opts *bind.WatchOpts, sink chan<- *EnsoulURI, id []*big.Int) (event.Subscription, error) {

	var idRule []interface{}
	for _, idItem := range id {
		idRule = append(idRule, idItem)
	}

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "URI", idRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulURI)
				if err := _Ensoul.contract.UnpackLog(event, "URI", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseURI is a log parse operation binding the contract event 0x6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b.
//
// Solidity: event URI(string value, uint256 indexed id)
func (_Ensoul *EnsoulFilterer) ParseURI(log types.Log) (*EnsoulURI, error) {
	event := new(EnsoulURI)
	if err := _Ensoul.contract.UnpackLog(event, "URI", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EnsoulUnpausedIterator is returned from FilterUnpaused and is used to iterate over the raw logs and unpacked data for Unpaused events raised by the Ensoul contract.
type EnsoulUnpausedIterator struct {
	Event *EnsoulUnpaused // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EnsoulUnpausedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EnsoulUnpaused)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EnsoulUnpaused)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EnsoulUnpausedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EnsoulUnpausedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EnsoulUnpaused represents a Unpaused event raised by the Ensoul contract.
type EnsoulUnpaused struct {
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterUnpaused is a free log retrieval operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_Ensoul *EnsoulFilterer) FilterUnpaused(opts *bind.FilterOpts) (*EnsoulUnpausedIterator, error) {

	logs, sub, err := _Ensoul.contract.FilterLogs(opts, "Unpaused")
	if err != nil {
		return nil, err
	}
	return &EnsoulUnpausedIterator{contract: _Ensoul.contract, event: "Unpaused", logs: logs, sub: sub}, nil
}

// WatchUnpaused is a free log subscription operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_Ensoul *EnsoulFilterer) WatchUnpaused(opts *bind.WatchOpts, sink chan<- *EnsoulUnpaused) (event.Subscription, error) {

	logs, sub, err := _Ensoul.contract.WatchLogs(opts, "Unpaused")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EnsoulUnpaused)
				if err := _Ensoul.contract.UnpackLog(event, "Unpaused", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseUnpaused is a log parse operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_Ensoul *EnsoulFilterer) ParseUnpaused(log types.Log) (*EnsoulUnpaused, error) {
	event := new(EnsoulUnpaused)
	if err := _Ensoul.contract.UnpackLog(event, "Unpaused", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
