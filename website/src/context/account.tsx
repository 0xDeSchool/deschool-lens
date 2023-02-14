/* eslint-disable class-methods-use-this */
import type { ReactElement } from 'react'
import React, { useState, useContext, createContext } from 'react'
import { removeToken } from '~/auth'
import { getWallet } from '~/wallet'
import type { ProfileExtend } from '~/lib/types/app'

export const DEFAULT_AVATAR = 'https://s3.us-east-1.amazonaws.com/deschool/Avatars/avatar_def.png'
export const DEFAULT_AVATAR_NAME = 'avatar_def.png'

const temp = {} as ProfileExtend

export class UserContext {
  setUser: React.Dispatch<React.SetStateAction<ProfileExtend>>

  constructor(setAction: React.Dispatch<React.SetStateAction<ProfileExtend>>) {
    this.setUser = setAction
  }

  changeUser(info: ProfileExtend) {
    this.setUser(info)
  }

  disconnect(): void {
    this.setUser(temp)
    getWallet().disconnect()
    removeToken()
  }
}

export const AccountContext = createContext<ProfileExtend>(temp)
let userContext = new UserContext(() => {})
export const AccountContextProvider = ({ children }: { children: ReactElement }) => {
  const [userInfo, setUserInfo] = useState<ProfileExtend>(temp)
  userContext = new UserContext(setUserInfo)
  return <AccountContext.Provider value={userInfo}>{children}</AccountContext.Provider>
}
export const useAccount = () => useContext(AccountContext) // 获取当前登录账号的profile信息
export function getUserContext() {
  return userContext
}
