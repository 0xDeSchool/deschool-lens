import { createProvider, getWallet, WalletConfig, WalletProvider, WalletType } from ".";
import { BNB, BNBTestnet } from "./chains";

const ccConfig: WalletConfig = {
  type: WalletType.MetaMask,
  chain: import.meta.env.MODE === 'production' ? BNB : BNBTestnet,
}

let ccProvider: WalletProvider | undefined

export async function ccWallet() {
  if (ccProvider === undefined) {
    ccProvider = createProvider(ccConfig)
  }
  const wallet = getWallet()
  await wallet.setProvider(WalletType.MetaMask, ccProvider)
  return wallet;
}
