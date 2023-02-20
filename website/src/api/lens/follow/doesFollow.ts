import { apolloClient } from '../index'
import type { DoesFollowRequest } from '../graphql/generated'
import { DoesFollowDocument } from '../graphql/generated'

const doesFollowRequest = async (request: DoesFollowRequest) => {
  const result = await apolloClient.query({
    query: DoesFollowDocument,
    variables: {
      request,
    },
  })

  return result.data.doesFollow
}

export const doesFollow = async (followerAddress: string, profileId: string) => {
  const followInfos = [
    {
      followerAddress,
      profileId,
    },
  ]
  const result = await doesFollowRequest({ followInfos })

  return result
}
