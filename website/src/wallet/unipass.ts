/* eslint-disable class-methods-use-this */

import { UniPassPopupSDK } from '@unipasswallet/popup-sdk'
import { UniPassTheme } from '@unipasswallet/popup-types'
import type { TransactionMessage, WalletProvider } from './wallet'

export class UniPassProvider implements WalletProvider {
  private wallet: any

  constructor() {
    this.initUnipassWallet()
  }

  async getConnectAccount(): Promise<string | undefined> {
    const account = await this.wallet.getAccount()
    return account?.address
  }

  async requestAccount(): Promise<string> {
    const address = await this.getConnectAccount()
    if (address) {
      return address
    }
    const account = await this.wallet.login({
      email: true,
      connectType: 'both',
    })
    return account.address
  }

  /**
   * init unipass wallet
   * @returns
   */
  initUnipassWallet() {
    this.wallet = new UniPassPopupSDK({
      env: 'prod',
      // for polygon mumbai
      chainType: 'polygon',
      // choose localStorage if you want to cache user account permanent
      storageType: 'localStorage',
      appSettings: {
        theme: UniPassTheme.LIGHT,
        appName: 'Deschool',
        appIcon: 'https://deschool.s3.amazonaws.com/logo.png',
      },
    })
  }

  /**
   * send erc20 token
   * @param tx
   * @returns
   */
  async sendTransaction(tx: TransactionMessage): Promise<string> {
    /* eslint-disable no-await-in-loop */
    /* eslint-disable no-promise-executor-return */
    const txHashERC20 = await this.wallet.sendTransaction(tx)
    const checkTxStatus = async (txHash: string) => {
      let tryTimes = 0
      while (tryTimes++ < 3) {
        const receipt = await this.wallet.getProvider().getTransactionReceipt(txHash)
        if (receipt) return receipt.status
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      return false
    }
    await checkTxStatus(txHashERC20)
    return txHashERC20
  }

  /**
   * sign message
   * @param message
   * @returns
   */
  async signMessage(message: string): Promise<string> {
    const signContent = await this.wallet.signMessage(message)
    return signContent
  }

  async mount(): Promise<void> {
    if (!this.wallet) {
      this.initUnipassWallet()
    }
  }

  async unmount(): Promise<void> {
    await this.wallet.logout()
  }
}
