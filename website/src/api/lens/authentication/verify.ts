import { getUserManager } from '~/account'
import { PlatformType } from '~/api/booth/booth'
import type { UserPlatform } from '~/api/booth/types'
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

export function getLens(): UserPlatform | undefined {
  const userContext = getUserManager().user
  return userContext?.platform(PlatformType.LENS)
}
