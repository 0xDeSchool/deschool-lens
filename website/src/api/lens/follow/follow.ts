import { ethers } from 'ethers'
import { omit } from '~/utils/omit'
import { splitSignature } from '../ethers.service'
import { apolloClient } from '../index'
import type { FollowRequest } from '../graphql/generated'
import { CreateFollowTypedDataDocument } from '../graphql/generated'
import { lensHub } from '../lens-hub'

export const createFollowTypedData = async (request: FollowRequest) => {
  const result = await apolloClient.mutate({
    mutation: CreateFollowTypedDataDocument,
    variables: {
      request,
    },
  })

  return result.data!.createFollowTypedData
}

export const followByProfileIdWithLens = async (profileId: string): Promise<string | undefined> => {
  const result = await createFollowTypedData({
    follow: [
      {
        profile: profileId,
      },
    ],
  })
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

  if (signer) {
    const tx = await lensHub(signer).followWithSig({
      follower: signer.getAddress(),
      profileIds: typedData.value.profileIds,
      datas: typedData.value.datas,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    })
    return tx.hash
  }
}
