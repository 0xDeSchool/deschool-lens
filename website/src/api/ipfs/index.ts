// import { create } from 'ipfs-http-client'

// const INFURA_PROJECT_ID = '2Lqk8SEjL85AW9nHLo319H6PPiM'
// const INFURA_SECRET = '38c0208d768dd41cedd7a879e75c3523'

// const projectId = INFURA_PROJECT_ID
// const secret = INFURA_SECRET

// if (!projectId || !secret) {
//   throw new Error('Must define INFURA_PROJECT_ID and INFURA_SECRET in the .env to run this')
// }

// const client = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: `Basic ${window.Buffer.from(`${projectId}:${secret}`, 'utf-8').toString('base64')}`,
//   },
// })

// export const uploadIpfs = async <T>(data: T) => {
//   const result = await client.add(JSON.stringify(data))

//   console.log('upload result ipfs', result)
//   return result
// }

// export const uploadIpfsGetPath = async <T>(data: T) => {
//   const result = await client.add(JSON.stringify(data))

//   console.log('upload result ipfs', result)
//   return result.path
// }

export {}
