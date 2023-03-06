import { getSignMessage, getUserInfo, login, unlinkPlatform } from "~/api/booth/account"
import { PlatformType } from "~/api/booth/booth"
import { SignMsgType, UserInfo, UserPlatform } from "~/api/booth/types"
import { getShortAddress } from "~/utils/format"
import { getWallet } from "~/wallet"
import { getCachedToken, removeToken, setToken } from "./token"

export class AccountInfo {
  id: string
  address: string
  displayName?: string
  avatar?: string
  bio?: string
  platforms?: UserPlatform[]

  constructor(info: UserInfo) {
    this.id = info.id
    this.address = info.address
    this.displayName = info.displayName
    this.avatar = info.avatar
    this.bio = info.bio
    this.platforms = info.platforms
  }

  platform(platform: PlatformType): UserPlatform | undefined {
    return this.platforms?.find(p => p.platform === platform)
  }

  formateName(): string | undefined {
    return this.displayName === this.address ? getShortAddress(this.address) : this.displayName
  }

  ccProfile(): UserPlatform | undefined {
    return this.platform(PlatformType.CYBERCONNECT)
  }

  lensProfile(): UserPlatform | undefined {
    return this.platform(PlatformType.LENS)
  }

  deschoolProfile(): UserPlatform | undefined {
    return this.platform(PlatformType.DESCHOOL)
  }
}

export class UserManager {
  private setUser: React.Dispatch<React.SetStateAction<AccountInfo | null>>
  private _user: AccountInfo | null = null

  constructor(setAction: React.Dispatch<React.SetStateAction<AccountInfo | null>>) {
    this.setUser = setAction
  }

  get user(): AccountInfo | null {
    return this._user
  }

  changeUser(info: AccountInfo) {
    this.setUser(info)
    this._user = info
  }

  async fetchUserInfo(addr: string, token?: string): Promise<AccountInfo | null> {
    if (!token) {
      const cachedToken = getCachedToken(addr)
      if (!cachedToken) {
        return null
      }
      token = cachedToken
    }
    setToken(addr, token)
    try {
      const info = await getUserInfo()
      if (!info) {
        return null
      }
      return new AccountInfo(info)
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  async login() {
    const address = await getWallet().getAddress()
    if (!address) {
      return
    }
    const info = await this.fetchUserInfo(address)
    if (info) {
      this.changeUser(info)
      return
    }
    const msg = await getSignMessage({ address, signType: SignMsgType.LOGIN })
    const signHex = await getWallet().signMessage(msg.message)
    const loginResult = await login({
      walletType: getWallet().type!,
      address,
      sig: signHex,
    })
    if (loginResult?.jwtToken) {
      const info = await this.fetchUserInfo(address, loginResult.jwtToken)
      if (info) {
        this.changeUser(info)
      }
    }
  }

  async tryAutoLogin() {
    const address = await getWallet().getConnectedAddress()
    if (!address) {
      return
    }
    const info = await this.fetchUserInfo(address)
    if (info) {
      this.changeUser(info)
    }
  }

  init(user: AccountInfo | null, setter: React.Dispatch<React.SetStateAction<AccountInfo | null>>) {
    this.setUser = setter
    this._user = user
  }

  async unLinkPlatform(handle: string, type: PlatformType) {
    await unlinkPlatform({ handle, platform: type })
  }

  disconnect(): void {
    this.setUser(null)
    getWallet().disconnect()
    removeToken()
  }
}


