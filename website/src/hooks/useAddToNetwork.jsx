import message from 'antd/es/message'

const toHex = num => `0x${num.toString(16)}`

export default async function addToNetwork({ address, chain, rpc }) {
  const params = {
    chainId: toHex(chain.chainId), // A 0x-prefixed hexadecimal string
    chainName: chain.name,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol, // 2-6 characters long
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrls: rpc ? [rpc] : chain.rpc.map(r => r.url),
    blockExplorerUrls: [chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url ? chain.explorers[0].url : chain.infoURL],
  }
  try {
    const res = await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params, address],
    })
    console.log('requestRes', res)
    return true
  } catch (error) {
    if (error.code === 4001) message.error('用户拒绝切换网络')
    throw error
  }
}
