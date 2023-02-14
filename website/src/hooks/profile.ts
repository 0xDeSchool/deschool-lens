import type { ProfileExtend } from '~/lib/types/app'

export const getExtendProfile = (profileInfo: any) => {
  const profile = { ...profileInfo }
  const { picture, coverPicture } = profile
  if (picture && picture.original && picture.original.url) {
    if (picture.original.url.startsWith('ipfs://')) {
      const result = picture.original.url.substring(7, picture.original.url.length)
      profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
    } else {
      profile.avatarUrl = picture.original.url
    }
    if (coverPicture.original.url.startsWith('ipfs://')) {
      const result = coverPicture.original.url.substring(7, coverPicture.original.url.length)
      profile.coverUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
    } else {
      profile.coverUrl = coverPicture.original.url
    }
  }
  return profile as ProfileExtend
}