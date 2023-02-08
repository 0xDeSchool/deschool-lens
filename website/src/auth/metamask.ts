export interface ConnectInfo {
  chainId: string
}

export interface ProviderMessage {
  type: string
  data: unknown
}

export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export function onAccountchanged(handler: (accounts: string[]) => void) {
  if (window.ethereum) {
    window.ethereum?.on('accountsChanged', (ac: string[]) => {
      ac = ac ?? []
      handler(ac)
    })
  }
  return () => {
    window.ethereum?.removeListener('accountsChanged', handler)
  }
}

export function onDisconnect(handler: (err: ProviderRpcError) => void) {
  if (window.ethereum) {
    window.ethereum.on('disconnect', handler)
  }
  return () => {
    window.ethereum?.removeListener('disconnect', handler)
  }
}

export function onChainChange(handler: (chainId: string) => void) {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', handler)
  }
  return () => {
    window.ethereum?.removeListener('chainChanged', handler)
  }
}
