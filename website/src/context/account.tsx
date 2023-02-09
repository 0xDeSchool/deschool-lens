/* eslint-disable class-methods-use-this */
import type { ReactElement } from 'react'
import React, { useState, useContext, createContext } from 'react'
import { removeToken } from '~/auth'
import { getWallet } from '~/wallet'
import type { Profile } from '~/api/lens/graphql/generated'
import { getDefaultProfileRequest } from '~/api/lens/profile/get-default-profile'
import type { Contact } from '~/lib/types/app'

export const DEFAULT_AVATAR = 'https://s3.us-east-1.amazonaws.com/deschool/Avatars/avatar_def.png'
export const DEFAULT_AVATAR_NAME = 'avatar_def.png'

export interface SocialLink extends Contact {
  description?: string
  icon?: string
  name?: string
}
const temp = {} as Profile

export class UserContext {
  setUser: React.Dispatch<React.SetStateAction<Profile>>

  constructor(setAction: React.Dispatch<React.SetStateAction<Profile>>) {
    this.setUser = setAction
  }

  changeUser(info: Profile) {
    this.setUser(info)
  }

  async fetchUserInfo(address: string): Promise<Profile | undefined> {
    const info = await getDefaultProfileRequest({ ethereumAddress: address })
    console.log('info', info)
    if (info) return info
  }

  disconnect(): void {
    this.setUser(temp)
    getWallet().disconnect()
    removeToken()
  }
}

export const AccountContext = createContext<Profile>(temp)
let userContext = new UserContext(() => {})
export const AccountContextProvider = ({ children }: { children: ReactElement }) => {
  const [userInfo, setUserInfo] = useState<Profile>(temp)
  userContext = new UserContext(setUserInfo)
  return <AccountContext.Provider value={userInfo}>{children}</AccountContext.Provider>
}
export const useAccount = () => useContext(AccountContext)
export function getUserContext() {
  return userContext
}
