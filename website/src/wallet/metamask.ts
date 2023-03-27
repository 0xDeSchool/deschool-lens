/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

import message from 'antd/es/message'
import { checkIsExpectChain, checkProvider } from '~/utils'
import type { ethers } from 'ethers'
import type { ProviderRpcError } from '~/auth'
import { onAccountchanged, onChainChange, onDisconnect } from '~/auth'
import type { TransactionMessage, WalletConfig, WalletProvider } from './wallet'
import { isMobile } from '~/utils/ua'
const toHex = (num: number) => `0x${num.toString(16)}`

export class MetaMaskProvider implements WalletProvider {
  config: WalletConfig

  private signer: ethers.providers.JsonRpcSigner

  private dispose?: () => void

  constructor(config: WalletConfig) {
    this.config = config
    if (!window.ethereum && !isMobile()) {
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
      // eslint-disable-next-line no-console
      console.log('getConnectAccount', err)
    }
  }

  // 切链
  private async changeChain(): Promise<boolean> {
    if (!this.config.chain) {
      return true
    }
    const chainid = toHex(this.config.chain.chainId)
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainid }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        // eslint-disable-next-line no-useless-catch
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainid,
                chainName: this.config.chain.name,
                nativeCurrency: this.config.chain.nativeCurrency,
                rpcUrls: this.config.chain.rpc.map(r => r.url),
                blockExplorerUrls: this.config.chain.explorers.map(e => e.url),
              },
            ],
          })
        } catch (addError) {
          console.log('changeChain', addError)
          return false
        }
      }
    }
    return true
  }

  private async checkChain(): Promise<boolean> {
    if (!this.config.chain) {
      return true
    }
    const isChainRight = checkIsExpectChain(this.config.chain.chainId)
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



