import { apolloClient } from '../index'
import type { ProfileQueryRequest } from '../graphql/generated'
import { ProfilesDocument } from '../graphql/generated'

export const getProfilesRequest = async (request: ProfileQueryRequest) => {
  const result = await apolloClient.query({
    query: ProfilesDocument,
    variables: {
      request,
    },
  })

  return result.data.profiles
}
