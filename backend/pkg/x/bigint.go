package x

import (
	"math/big"
)

type BigInt struct {
	i *big.Int
}

func NewBigInt(bigint *big.Int) BigInt {
	if bigint == nil {
		panic("bigint must be not nil")
	}
	return BigInt{i: bigint}
}

func ParseBigInt(v string) BigInt {
	n := big.NewInt(0)
	n.SetString(v, 10)
	return NewBigInt(n)
}

func (bi *BigInt) Int() *big.Int {
	return bi.i
}

func (bi *BigInt) MarshalBSON() ([]byte, error) {
	return []byte(bi.i.String()), nil
}

func (bi *BigInt) UnmarshalBSON(data []byte) error {
	n := big.NewInt(0)
	n.SetString(string(data), 10)
	bi.i = n
	return nil
}

func (bi *BigInt) MarshalJSON() ([]byte, error) {
	return []byte(bi.i.String()), nil
}

func (bi *BigInt) UnmarshalJSON(data []byte) error {
	n := big.NewInt(0)
	n.SetString(string(data), 10)
	bi.i = n
	return nil
}
