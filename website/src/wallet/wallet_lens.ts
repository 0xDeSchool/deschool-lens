import { createProvider, getWallet, WalletConfig, WalletProvider, WalletType } from ".";
import { Polygon } from "./chains";

const lensConfig: WalletConfig = {
  type: WalletType.MetaMask,
  chain: Polygon,
}

let lensProvider: WalletProvider | undefined

export async function lensWallet() {
  if (lensProvider === undefined) {
    lensProvider = createProvider(lensConfig)
  }
  const wallet = getWallet()
  await wallet.setProvider(WalletType.MetaMask, lensProvider)
  return wallet;
}
