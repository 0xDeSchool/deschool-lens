import type { WalletConfig, WalletProvider} from ".";
import { createProvider, getWallet, WalletType } from ".";

const boothConfig: WalletConfig = {
  type: WalletType.MetaMask,
}

let boothProvider: WalletProvider | undefined

export async function appWallet() {
  if (boothProvider === undefined) {
    boothProvider = createProvider(boothConfig)
  }
  const wallet = getWallet()
  await wallet.setProvider(WalletType.MetaMask, boothProvider)
  return wallet
}