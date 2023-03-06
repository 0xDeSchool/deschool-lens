/* eslint-disable class-methods-use-this */
import type { ReactElement } from 'react'
import { useState, useContext, createContext } from 'react'
import { AccountInfo, UserManager } from './user'

export const DEFAULT_AVATAR = 'https://s3.us-east-1.amazonaws.com/deschool/Avatars/avatar_def.png'
export const DEFAULT_AVATAR_NAME = 'avatar_def.png'

let _manager = new UserManager(() => { })

export const AccountContext = createContext<AccountInfo | null>(null)

export const AccountContextProvider = ({ children }: { children: ReactElement }) => {
  const [userInfo, setUserInfo] = useState<AccountInfo | null>(null)
  _manager.init(userInfo, setUserInfo)
  return <AccountContext.Provider value={userInfo}>{children}</AccountContext.Provider>
}

export const useAccount = () => useContext(AccountContext)

export function getUserManager() {
  return _manager
}
