/* eslint-disable no-console */
import { getDefaultProfileRequest } from '~/api/lens/profile/get-default-profile'
import type { ProfileExtend } from '~/lib/types/app'

export const getExtendProfile = (profileInfo: any) => {
  const profile = { ...profileInfo }
  if (!profile) return profileInfo
  const { picture, coverPicture } = profile
  if (picture && picture.original && picture.original.url) {
    if (picture.original.url.startsWith('ipfs://')) {
      const result = picture.original.url.substring(7, picture.original.url.length)
      profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
    } else {
      profile.avatarUrl = picture.original.url
    }
  }
  if (coverPicture && coverPicture?.original && coverPicture.original.url) {
    if (coverPicture.original.url.startsWith('ipfs://')) {
      const result = coverPicture.original.url.substring(7, coverPicture.original.url.length)
      profile.coverUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
    } else {
      profile.coverUrl = coverPicture?.original?.url
    }
  }
  return profile as ProfileExtend
}

// 根据地址获取默认profile信息并预处理头像和背景图
export const fetchUserDefaultProfile = async (address: string): Promise<ProfileExtend | undefined> => {
  const info = await getDefaultProfileRequest({ ethereumAddress: address })
  console.log('*********** hook fetchUserDefaultProfile start ************')
  console.log('address', address)
  console.log('getExtendProfile', getExtendProfile(info))
  console.log('*********** hook fetchUserDefaultProfile end ************')
  if (info) return getExtendProfile(info)
}
