import { apolloClient } from '../index'
import type { FollowingRequest } from '../graphql/generated'
import { FollowingDocument } from '../graphql/generated'

export const followingRequest = async (request: FollowingRequest) => {
  const result = await apolloClient.query({
    query: FollowingDocument,
    variables: {
      request,
    },
  })

  return result.data.following
}
