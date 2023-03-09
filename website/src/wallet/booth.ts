import { createProvider, getWallet, WalletConfig, WalletProvider, WalletType } from ".";

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