// import type { ethers } from 'ethers'
import { createProvider } from '.'
import { MetaMaskProvider } from './metamask'
import { UniPassProvider } from './unipass'

export enum WalletType {
  None = '_',
  MetaMask = 'MetaMask',
  UniPass = 'UniPass',
}

export type TransactionMessage = {
  from: string
  to: string
  value: string
  data: string
}

export type WalletConfig = {
  type: WalletType
  chainId?: string
  [key: string]: any

  accountChanged?: (account: string) => Promise<void>
  disconnected?: () => Promise<void>
  chainChanged?: (chain: string) => Promise<void>
}

export class Wallet {
  private provider: WalletProvider | undefined

  // private signer?: ethers.Signer | undefined

  public type?: WalletType

  async setProvider(type: WalletType, p: WalletProvider): Promise<void> {
    if (this.provider === p) {
      return
    }
    await this.provider?.unmount()
    this.provider = p
    await p.mount()
    this.type = type
    localStorage.setItem('booth:WalletType', JSON.stringify(p.config))
  }

  // async setSigner(s: ethers.Signer): Promise<void> {
  //   if (this.signer === s) {
  //     return
  //   }
  //   this.signer = await this.provider?.getSigner()
  // }

  async disconnect(): Promise<void> {
    await this.provider?.unmount()
    this.provider = undefined
    this.type = WalletType.None
    localStorage.removeItem('booth:WalletType')
  }

  protected getProvider(): WalletProvider {
    const p = this.tryGetProvider()
    if (!p) {
      throw new Error('not set wallet')
    }
    return p
  }

  // protected tryGetSigner(): ethers.Signer | undefined {
  //   return this.signer
  // }

  protected tryGetProvider(): WalletProvider | undefined {
    if (this.provider === undefined) {
      const wt = localStorage.getItem('booth:WalletType')
      if (wt) {
        const config = JSON.parse(wt)
        const p = createProvider(config)
        this.setProvider(config.type, p)
        return p
      }
    }
    return this.provider
  }


  signMessage(msg: string): Promise<string> {
    return this.getProvider().signMessage(msg)
  }

  getAddress(): Promise<string | undefined> {
    return this.getProvider().requestAccount()
  }

  async getConnectedAddress(): Promise<string | undefined> {
    const account = await this.tryGetProvider()?.getConnectAccount()
    return account
  }

  // async getSigner(): Promise<ethers.Signer | undefined> {
  //   const signer = await this.tryGetSigner()
  //   return signer
  // }
}

export interface WalletProvider {
  config: WalletConfig

  getConnectAccount(): Promise<string | undefined>
  requestAccount(): Promise<string | undefined>
  signMessage(msg: string): Promise<string>
  sendTransaction(tx: TransactionMessage): Promise<string>

  mount(): Promise<void>
  unmount(): Promise<void>
}

type ProviderCreator = (conf: WalletConfig) => WalletProvider

export class WalletProviderFactory {
  providers: { [key: string]: ProviderCreator }

  constructor() {
    this.providers = {
      [WalletType.MetaMask]: c => new MetaMaskProvider(c),
      [WalletType.UniPass]: () => new UniPassProvider(),
    }
  }

  create(conf: WalletConfig): WalletProvider {
    const p = this.providers[conf.type]
    if (!p) {
      throw new Error('wallet type is not found')
    }
    return p(conf)
  }
}
