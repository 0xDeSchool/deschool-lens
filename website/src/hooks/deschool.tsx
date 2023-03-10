import { getUserProfile } from '~/api/go/account'
import type { Contact } from '~/lib/types/app'

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

export interface SocialLink extends Contact {
  description?: string
  icon?: string
  name?: string
}

// 获取当前用户的deschool信息，默认根据缓存中的deschool token认定身份
export const fetchUserInfoFromDeschool = async (): Promise<UserInfoStruct | null> => {
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
  }
}
