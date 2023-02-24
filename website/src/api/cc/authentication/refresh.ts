import { apolloClient } from '../index'
import type { RefreshRequest } from '../graphql/generated'
import { RefreshDocument } from '../graphql/generated'

export const refreshAuth = async (request: RefreshRequest) => {
  const result = await apolloClient.mutate({
    mutation: RefreshDocument,
    variables: {
      request,
    },
  })

  return result.data!.refresh
}
