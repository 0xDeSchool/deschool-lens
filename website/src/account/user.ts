import { getSignMessage, getUserInfo, login, unlinkPlatform } from "~/api/booth/account"
import { PlatformType } from "~/api/booth/booth"
import type { Contact, LinkPlatformRequest, UserInfo, UserPlatform } from "~/api/booth/types";
import { SignMsgType } from "~/api/booth/types"
import { getShortAddress } from "~/utils/format"
import { getWallet } from "~/wallet"
import { appWallet } from "~/wallet/booth";
import { getCachedToken, removeToken, setToken } from "./token"

export class AccountInfo {
  id: string

  address: string

  displayName?: string

  avatar?: string

  bio?: string

  contacts?: Contact[]

  platforms?: UserPlatform[]

  constructor(info: UserInfo) {
    this.id = info.id
    this.address = info.address
    this.displayName = info.displayName
    this.avatar = info.avatar
    this.bio = info.bio
    this.platforms = info.platforms
    this.contacts = info.contacts
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

  ccProfileList(addr?: string): UserPlatform[] | undefined {
    return this.platforms?.filter(p => p.platform === PlatformType.CYBERCONNECT && !addr || p.address === addr)
  }

  lensProfile(): UserPlatform | undefined {
    return this.platform(PlatformType.LENS)
  }

  lensProfileList(): UserPlatform[] | undefined {
    return this.platforms?.filter(p => p.platform === PlatformType.LENS)
  }

  deschoolProfile(): UserPlatform | undefined {
    return this.platform(PlatformType.DESCHOOL)
  }

  deschoolProfileList(): UserPlatform[] | undefined {
    return this.platforms?.filter(p => p.platform === PlatformType.DESCHOOL)
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

  async fetchUserInfo(addr: string, token?: string): Promise<AccountInfo | null> { // eslint-disable-line class-methods-use-this
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

  async login(platform?: LinkPlatformRequest) {
    const wallet = await appWallet()
    const address = await wallet.getAddress()
    if (!address) {
      return
    }
    const info = await this.fetchUserInfo(address)
    if (info) {
      this.changeUser(info)
      return
    }
    const msg = await getSignMessage({ address, signType: SignMsgType.LOGIN })
    const signHex = await wallet.signMessage(msg.message)
    const loginResult = await login({
      walletType: wallet.type!,
      address,
      sig: signHex,
      platform,
    })
    if (loginResult?.jwtToken) {
      const infoVal = await this.fetchUserInfo(address, loginResult.jwtToken)
      if (infoVal) {
        this.changeUser(infoVal)
      }
    }
  }

  async tryAutoLogin() {
    const wallet = await appWallet()
    const address = await wallet.getConnectedAddress()
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

  async unLinkPlatform(handle: string, address: string, type: PlatformType) { // eslint-disable-line class-methods-use-this
    await unlinkPlatform({ handle, platform: type, address })
  }

  disconnect(): void {
    this.setUser(null)
    getWallet().disconnect()
    removeToken()
  }
}


