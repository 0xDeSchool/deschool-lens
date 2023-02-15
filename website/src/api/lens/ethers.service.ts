import type { ethers } from 'ethers'
import { utils } from 'ethers'

export const getAddressFromSigner = (signer: ethers.Signer) => signer.getAddress()

export const splitSignature = (signature: string) => utils.splitSignature(signature)

export const sendTx = (signer: ethers.Signer, transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>) =>
  signer.sendTransaction(transaction)

export const signText = (signer: ethers.Signer, text: string) => signer.signMessage(text)
