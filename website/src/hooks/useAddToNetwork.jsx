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
    if (error.code === 4001) message.error(t('4001'))
    throw error
  }
}

export async function swtichChain({ chain, rpc }) {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: toHex(chain.chainId) }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      // eslint-disable-next-line no-useless-catch
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: toHex(chain.chainId),
              chainName: chain.name,
              rpcUrls: rpc ? [rpc] : chain.rpc.map(r => r.url),
            },
          ],
        })
        // eslint-disable-next-line no-useless-catch
      } catch (addError) {
        // handle "add" error
        throw addError
      }
    }
  }
}
