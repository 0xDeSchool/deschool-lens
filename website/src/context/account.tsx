/* eslint-disable class-methods-use-this */
import type { ReactElement } from 'react'
import React, { useState, useContext, createContext } from 'react'
import { getUserProfile } from '~/api/account'
import { getCachedToken, setToken, removeToken } from '~/auth'
import { getWallet } from '~/wallet'
import type { Contact } from '~/lib/types/app'

export const DEFAULT_AVATAR = 'https://s3.us-east-1.amazonaws.com/deschool/Avatars/avatar_def.png'
export const DEFAULT_AVATAR_NAME = 'avatar_def.png'

export interface SocialLink extends Contact {
  description?: string
  icon?: string
  name?: string
}

export interface UserInfoStruct {
  id?: string
  address?: string
  username?: string
  avatar: string
  token?: string
  firstConnected?: boolean
  bio?: string
  contacts?: SocialLink[]
}

const tempUser: UserInfoStruct = {
  avatar: DEFAULT_AVATAR,
}

export class UserContext {
  setUser: React.Dispatch<React.SetStateAction<UserInfoStruct>>

  constructor(setAction: React.Dispatch<React.SetStateAction<UserInfoStruct>>) {
    this.setUser = setAction
  }

  changeUser(info: UserInfoStruct) {
    this.setUser(info)
  }

  async fetchUserInfo(addr: string, token?: string): Promise<UserInfoStruct | null> {
    if (!token) {
      const cachedToken = getCachedToken(addr)
      if (!cachedToken) {
        return null
      }
      token = cachedToken
    }
    setToken(addr, token)
    const info = await getUserProfile()
    if (!info) {
      return null
    }
    return {
      id: info.id,
      address: info.address,
      username: info.username,
      avatar: info.avatar,
      contacts: info.contacts,
      bio: info.bio,
      token,
    }
  }

  disconnect(): void {
    this.setUser({ ...tempUser })
    getWallet().disconnect()
    removeToken()
  }
}

export const AccountContext = createContext<UserInfoStruct>(tempUser)
let userContext = new UserContext(() => {})
export const AccountContextProvider = ({ children }: { children: ReactElement }) => {
  const [userInfo, setUserInfo] = useState<UserInfoStruct>(tempUser)
  userContext = new UserContext(setUserInfo)
  return <AccountContext.Provider value={userInfo}>{children}</AccountContext.Provider>
}
export const useAccount = () => useContext(AccountContext)
export function getUserContext() {
  return userContext
}
