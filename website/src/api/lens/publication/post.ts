import { BigNumber, utils, ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { omit } from '~/utils/omit'
// import type { Metadata} from '~/lib/types/publication';
// import { PublicationMainFocus } from '~/lib/types/publication'
import type { Metadata } from '~/lib/types/publication'
import { PublicationMainFocus } from '~/lib/types/publication'
import { uploadIpfs } from '~/api/ipfs'
import { getUserContext } from '~/context/account'
import { apolloClient } from '../index'
import { splitSignature } from '../ethers.service'
import type { CreatePublicPostRequest, PublicationsQueryRequest } from '../graphql/generated'
import { PublicationsDocument, CreatePostTypedDataDocument } from '../graphql/generated'

import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed'
// import { uploadIpfs } from '../../ipfs'
import { lensHub } from '../lens-hub'

const BOOTH_PATH = import.meta.env.VITE_APP_BOOTH_PATH

export const createPostTypedData = async (request: CreatePublicPostRequest) => {
  const result = await apolloClient.mutate({
    mutation: CreatePostTypedDataDocument,
    variables: {
      request,
    },
  })

  return result.data!.createPostTypedData
}

export const signCreatePostTypedData = async (request: CreatePublicPostRequest) => {
  const result = await createPostTypedData(request)
  console.log('create post: createPostTypedData', result)

  const { typedData } = result
  // 拿当前小狐狸的signer调用合约
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const signature = await signer._signTypedData(
    omit(typedData.domain, '__typename'),
    omit(typedData.types, '__typename'),
    omit(typedData.value, '__typename'),
  )
  console.log('create post: signature', signature)

  return { result, signature }
}

export const pollAndIndexPost = async (txHash: string, profileId: string) => {
  console.log(`create post: poll until indexed`)
  const indexedResult = await pollUntilIndexed({ txHash })

  console.log(`create post: profile has been indexed`)
  if (indexedResult) {
    const { logs } = indexedResult.txReceipt!

    console.log(`create post: logs`, logs)

    const topicId = utils.id('PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)')
    console.log('topicid we care about', topicId)

    const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId)
    console.log(`create post: created log`, profileCreatedLog)

    const profileCreatedEventLog = profileCreatedLog!.topics
    console.log(`create post: created event logs`, profileCreatedEventLog)

    const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0]

    const contractPublicationId = BigNumber.from(publicationId).toHexString()

    const internalPublicationId = `${profileId}-${contractPublicationId}`

    console.log(`create post: contract publication id`, contractPublicationId)
    console.log(`create post: internal publication id`, internalPublicationId)
    return internalPublicationId
  }
}

// TODO：暂时先写死一个模板，下个版本再通过IPFS上传用户编辑过的内容
export const createPost = async (profileId: string, address: string, content: string): Promise<string | undefined> => {
  if (!profileId) {
    throw new Error('createPost Error: profileId missing')
  }
  console.log(`create post: address`, address)
  console.log(`create post: content`, content)

  const CONTENT_TEXT = `
  Hey everyone! I'm excited to announce that I've just created my resume using the latest web3 approach! With Booth, IPFS and Lens, I've created a fully decentralized resume that I can easily share with anyone. If you're interested in checking it out, please follow the link below. I'd love to hear your feedback on this new approach to resume building! #jobsearch #resume #decentralized #LensProtocol #IPFS

  LINK👇👇👇👇👇:
  ${BOOTH_PATH}/profile/${getUserContext().lensToken?.address}/resume


  __METADATA_BELOW__

  ${content}

  `

  const ipfsResult = await uploadIpfs<Metadata>({
    version: '2.0.0',
    mainContentFocus: PublicationMainFocus.TEXT_ONLY,
    metadata_id: uuidv4(),
    description: `Visit deschool.app to view resume!`,
    locale: 'en-US',
    content: CONTENT_TEXT,
    external_url: null,
    image: null, // TODO
    imageMimeType: null,
    name: `Booth Resume for LensId ${profileId}`,
    attributes: [],
    // tags: ['using_api_examples'], // TODO
    // appId: 'api_examples_github', // TODO
  })
  console.log(`create post: ipfs result`, ipfsResult, ipfsResult.cid, ipfsResult.path)

  // hard coded to make the code example clear
  const createPostRequest: CreatePublicPostRequest = {
    profileId,
    contentURI: `ipfs://${ipfsResult.path}`,
    // `${BOOTH_PATH}/resume/${address}`,
    // contentURI: `ipfs://QmPogtffEF3oAbKERsoR4Ky8aTvLgBF5totp5AuF8YN6vl`,
    collectModule: {
      freeCollectModule: { followerOnly: true },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  }

  const signedResult = await signCreatePostTypedData(createPostRequest)
  console.log(`create post: signedResult`, signedResult)
  const { typedData } = signedResult.result

  // 拿当前小狐狸的signer调用合约
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  if (signer) {
    const { v, r, s } = splitSignature(signedResult.signature)

    const tx = await lensHub(signer).postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    })
    console.log(`create post: tx hash`, tx.hash)
    return tx.hash
  }
}

export const GETPUBLICATIONSRequest = async (request: PublicationsQueryRequest) => {
  const result = await apolloClient.query({
    query: PublicationsDocument,
    variables: {
      request,
    },
  })

  return result.data.publications
}
