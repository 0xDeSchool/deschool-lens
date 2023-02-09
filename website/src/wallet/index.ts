import { AppWallet } from './appWallet'
import { WalletProviderFactory } from './wallet'
import type { WalletConfig, WalletProvider } from './wallet'

export * from './wallet'

const wallet: AppWallet = new AppWallet()
const factory: WalletProviderFactory = new WalletProviderFactory()

export function getWallet(): AppWallet {
  return wallet
}

export function createProvider(config: WalletConfig): WalletProvider {
  return factory.create(config)
}
