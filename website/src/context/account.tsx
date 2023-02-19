/* eslint-disable class-methods-use-this */
import type { Dispatch, ReactElement, SetStateAction } from 'react'
import { useEffect, useMemo, useState, useContext, createContext } from 'react'

import { getWallet } from '~/wallet'
import { RoleType } from '~/lib/enum'
import type { AccountContextProps, ProfileExtend, DeschoolTokenInfo, LensTokenInfo } from '~/lib/types/app'

export const DEFAULT_AVATAR = 'https://s3.us-east-1.amazonaws.com/deschool/Avatars/avatar_def.png'
export const DEFAULT_AVATAR_NAME = 'avatar_def.png'

export class UserContext {
  lensProfile: ProfileExtend | null

  deschoolToken: DeschoolTokenInfo | null

  lensToken: LensTokenInfo | null

  setLensProfile: Dispatch<SetStateAction<ProfileExtend | null>>

  setDescoolToken: Dispatch<SetStateAction<DeschoolTokenInfo | null>>

  setLensToken: Dispatch<SetStateAction<LensTokenInfo | null>>

  constructor(accountMemo: AccountContextProps) {
    this.lensProfile = accountMemo.lensProfile
    this.deschoolToken = accountMemo.deschoolToken
    this.lensToken = accountMemo.lensToken
    this.setLensProfile = accountMemo.setLensProfile
    this.setDescoolToken = accountMemo.setDescoolToken
    this.setLensToken = accountMemo.setLensToken
  }

  // 设置当前lens账号默认的profile
  changeUserProfile(info: ProfileExtend) {
    this.setLensProfile(info)
  }

  // 断开lens的连接
  disconnectFromLens = (): void => {
    this.setLensProfile(null)
    this.setLensToken(null)
    localStorage.removeItem('lensProfile')
    localStorage.removeItem('lensToken')
    getWallet().disconnect()
  }

  // 断开deschool的连接
  disconnectFromDeschool = (): void => {
    this.setDescoolToken(null)
    localStorage.removeItem('deschoolToken')
    getWallet().disconnect()
  }

  // 根据登录情况，获取登录角色
  getLoginRoles = () => {
    // Visitor: deschool token和lens token都不存在
    // UserWithHandle: lens token存在并且 profile handle存在
    // UserWithoutHandle: lens token存在并且 profile handle不存在
    // UserOfDeschool: deschool token存在
    const roles = [] as RoleType[]
    if (!this.deschoolToken && !this.lensToken) {
      roles.push(RoleType.Visitor)
    }
    if (this.lensToken && this.lensProfile?.handle) {
      roles.push(RoleType.UserOfLens)
    }
    if (this.deschoolToken) {
      roles.push(RoleType.UserOfDeschool)
    }
    return roles
  }
}

export const AccountContext = createContext<AccountContextProps>({
  lensProfile: null,
  deschoolToken: null,
  lensToken: null,
  setLensProfile: () => {},
  setDescoolToken: () => {},
  setLensToken: () => {},
})

const getStorage = (type: string) => {
  const item = localStorage.getItem(type)
  if (item) {
    return JSON.parse(item)
  }
  return null
}

// eslint-disable-next-line import/no-mutable-exports
let userContext: UserContext = new UserContext({
  lensProfile: null,
  deschoolToken: null,
  lensToken: null,
  setLensProfile: () => {},
  setDescoolToken: () => {},
  setLensToken: () => {},
})

export const AccountContextProvider = ({ children }: { children: ReactElement }) => {
  const [lensProfile, setLensProfile] = useState<ProfileExtend | null>(getStorage('lensProfile'))
  const [deschoolToken, setDescoolToken] = useState<DeschoolTokenInfo | null>(getStorage('deschoolToken'))
  const [lensToken, setLensToken] = useState<LensTokenInfo | null>(getStorage('lensToken'))

  const accountMemo = useMemo(
    () => ({
      lensProfile: null,
      deschoolToken: null,
      lensToken: null,
      setLensProfile: () => {},
      setDescoolToken: () => {},
      setLensToken: () => {},
    }),
    [lensProfile, deschoolToken, lensToken, setLensProfile, setDescoolToken, setLensToken],
  )

  useEffect(() => {
    if (lensProfile) {
      localStorage.setItem('lensProfile', JSON.stringify(lensProfile))
    } else {
      localStorage.removeItem('lensProfile')
    }
  }, [lensProfile])

  useEffect(() => {
    if (deschoolToken) {
      localStorage.setItem('deschoolToken', JSON.stringify(deschoolToken))
    } else {
      localStorage.removeItem('deschoolToken')
    }
  }, [deschoolToken])

  useEffect(() => {
    if (lensToken) {
      localStorage.setItem('lensToken', JSON.stringify(lensToken))
    } else {
      localStorage.removeItem('deschoolToken')
    }
  }, [lensToken])

  userContext = new UserContext({ lensProfile, deschoolToken, lensToken, setLensProfile, setDescoolToken, setLensToken })
  return <AccountContext.Provider value={accountMemo}>{children}</AccountContext.Provider>
}

export const useAccount = () => {
  const account = useContext(AccountContext)
  return account
}

export const getUserContext = () => userContext
