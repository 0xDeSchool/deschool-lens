import { Wallet } from './wallet'

export class AppWallet extends Wallet {
  // eslint-disable-next-line class-methods-use-this
  async init(param: string): Promise<any> {
    return param
  }

  // eslint-disable-next-line class-methods-use-this
  async destroy(param: string): Promise<any> {
    return param
  }
}
