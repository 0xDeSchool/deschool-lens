import { apolloClient } from '../index' 
import type { HasTxHashBeenIndexedRequest } from '../graphql/generated'
import { HasTxHashBeenIndexedDocument } from '../graphql/generated'

const hasTxBeenIndexed = async (request: HasTxHashBeenIndexedRequest) => {
  const result = await apolloClient.query({
    query: HasTxHashBeenIndexedDocument,
    variables: {
      request,
    },
    fetchPolicy: 'network-only',
  })

  return result.data.hasTxHashBeenIndexed
}

export const pollUntilIndexed = async (input: { txHash: string } | { txId: string }) => {
  const response = await hasTxBeenIndexed(input)
  console.log('pool until indexed: result', response)

  if (response.__typename === 'TransactionIndexedResult') {
    console.log('pool until indexed: indexed', response.indexed)
    console.log('pool until metadataStatus: metadataStatus', response.metadataStatus)

    console.log(response.metadataStatus)
    if (response.metadataStatus) {
      if (response.metadataStatus.status === 'SUCCESS') {
        return response
      }

      if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
        throw new Error(response.metadataStatus.status)
      }
    } else if (response.indexed) {
      return response
    }
  } else {
    // it got reverted and failed!
    throw new Error(response.reason)
  }
}
