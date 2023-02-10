import { apolloClient } from '../index'
import type { DefaultProfileRequest, Profile } from '../graphql/generated'
import { DefaultProfileDocument } from '../graphql/generated'

export const getDefaultProfileRequest = async (request: DefaultProfileRequest) => {
  const result = await apolloClient.query({
    query: DefaultProfileDocument,
    variables: {
      request,
    },
  })

  return result.data.defaultProfile as Profile
}
