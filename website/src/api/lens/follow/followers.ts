import { apolloClient } from '../index'
import type { FollowersRequest } from '../graphql/generated'
import { FollowersDocument } from '../graphql/generated'

export const followersRequest = async (request: FollowersRequest) => {
  const result = await apolloClient.query({
    query: FollowersDocument,
    variables: {
      request,
    },
  })

  return result.data.followers
}
