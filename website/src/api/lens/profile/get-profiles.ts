import { apolloClient } from '../index'
import type { ExploreProfilesRequest, ProfileQueryRequest } from '../graphql/generated'
import { ExploreProfilesDocument, ProfilesDocument } from '../graphql/generated'

export const getProfilesRequest = async (request: ProfileQueryRequest) => {
  const result = await apolloClient.query({
    query: ProfilesDocument,
    variables: {
      request,
    },
  })

  return result.data?.profiles
}

export const exploreProfilesRequest = async (request: ExploreProfilesRequest) => {
  const result = await apolloClient.query({
    query: ExploreProfilesDocument,
    variables: {
      request,
    },
  })

  return result.data.exploreProfiles
}
