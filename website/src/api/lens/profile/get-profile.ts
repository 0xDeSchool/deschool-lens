import { apolloClient } from '../index'
import type { Profile, SingleProfileQueryRequest } from '../graphql/generated'
import { ProfileDocument } from '../graphql/generated'

export const getProfileRequest = async (request: SingleProfileQueryRequest) => {
  const result = await apolloClient.query({
    query: ProfileDocument,
    variables: {
      request,
    },
  })

  return result.data.profile as Profile
}
