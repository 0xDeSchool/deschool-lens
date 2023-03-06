/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

import message from 'antd/es/message'
import { checkIsExpectChain, checkProvider } from '~/utils'
import type { ethers } from 'ethers'
import type { ProviderRpcError } from '~/auth'
import { onAccountchanged, onChainChange, onDisconnect } from '~/auth'
import { swtichChain } from '~/hooks/useAddToNetwork'
// import * as polygonchain from '~/assets/chain.json'
import * as binanceTestnetChain from '~/assets/chain_binance_testnet.json'
import type { TransactionMessage, WalletConfig, WalletProvider } from './wallet'

export class MetaMaskProvider implements WalletProvider {
  config: WalletConfig

  private signer: ethers.providers.JsonRpcSigner

  private dispose?: () => void

  constructor(config: WalletConfig) {
    this.config = config
    if (!window.ethereum) {
      message.error('not Install MetaMask')
    }
    const p = checkProvider()
    if (!p) {
      message.error('can not get ether provider')
    }
    this.signer = p.getSigner()
  }

  async getConnectAccount(): Promise<string | undefined> {
    try {
      const acts = await window.ethereum.request({
        method: 'eth_accounts',
      })
      if (acts && acts.length > 0) {
        return acts[0]
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 切链
  private async changeChain(): Promise<boolean> {
    try {
      await swtichChain({ chain: binanceTestnetChain, rpc: null })
      return true
    } catch (err) {
      console.log(err)
    }
    return false
  }

  private async checkChain(): Promise<boolean> {
    const isChainRight = checkIsExpectChain()
    if (!isChainRight) {
      const result = await this.changeChain()
      return result
    }
    return isChainRight
  }

  async requestAccount(): Promise<string | undefined> {
    const isChainRight = await this.checkChain()
    if (!isChainRight) {
      return
    }
    let acts = await this.getConnectAccount()
    if (acts) {
      return acts
    }
    acts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    if (acts && acts.length > 0) {
      return acts[0]
    }
  }

  async sendTransaction(tx: TransactionMessage): Promise<string> {
    const isChainRight = await this.checkChain()
    if (!isChainRight) {
      return ''
    }
    const result = await this.signer.sendUncheckedTransaction(tx)
    return result
  }

  async signMessage(msg: string): Promise<string> {
    const isChainRight = await this.checkChain()
    if (!isChainRight) {
      return ''
    }
    return this.signer.signMessage(msg)
  }

  async mount(): Promise<void> {
    this.disposing()
    const d1 = onAccountchanged(a => this.accountChanged(a))
    const d2 = onDisconnect(a => this.disconnected(a))
    const d3 = onChainChange(c => this.onChainChanged(c))
    this.dispose = () => {
      d1()
      d2()
      d3()
    }
  }

  async unmount(): Promise<void> {
    this.disposing()
  }

  disposing() {
    if (this.dispose) {
      this.dispose()
    }
  }

  accountChanged(account: string[]): void {
    if (this.config.accountChanged) {
      if (account) {
        this.config.accountChanged(account[0])
      }
    }
  }

  disconnected(err: ProviderRpcError): void {
    if (this.config.disconnected) {
      this.config.disconnected()
    }
  }

  onChainChanged(chainId: string): void {
    if (this.config.chainChanged) {
      this.config.chainChanged(chainId)
    }
  }
}
