import { apolloClient } from '../index'
import type { VerifyRequest } from '../graphql/generated'
import { VerifyDocument } from '../graphql/generated'

export const verify = async (request: VerifyRequest) => {
  const result = await apolloClient.query({
    query: VerifyDocument,
    variables: {
      request,
    },
  })

  return result.data.verify
}
