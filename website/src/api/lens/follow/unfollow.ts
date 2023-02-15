import { ethers } from 'ethers'
import { omit } from '~/utils/omit'
import LENS_FOLLOW_NFT_ABI from '~/api/abis/lens-follow-nft-contract-abi.json'
import { apolloClient } from '../index'
import { splitSignature } from '../ethers.service'
import type { UnfollowRequest } from '../graphql/generated'
import { CreateUnfollowTypedDataDocument } from '../graphql/generated'

const createUnfollowTypedData = async (request: UnfollowRequest) => {
  const result = await apolloClient.mutate({
    mutation: CreateUnfollowTypedDataDocument,
    variables: {
      request,
    },
  })

  return result.data!.createUnfollowTypedData
}

export const unfollowByProfileIdWithLens = async (profileId: string): Promise<string | undefined> => {
  const result = await createUnfollowTypedData({ profile: profileId })

  const { typedData } = result
  // 拿当前小狐狸的signer调用合约
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const signature = await signer._signTypedData(
    omit(typedData.domain, '__typename'),
    omit(typedData.types, '__typename'),
    omit(typedData.value, '__typename'),
  )
  const { v, r, s } = splitSignature(signature)

  // load up the follower nft contract
  const followNftContract = new ethers.Contract(typedData.domain.verifyingContract, LENS_FOLLOW_NFT_ABI, signer)

  const sig = {
    v,
    r,
    s,
    deadline: typedData.value.deadline,
  }

  // force the tx to send
  const tx = await followNftContract.burnWithSig(typedData.value.tokenId, sig)
  return tx.hash
}
