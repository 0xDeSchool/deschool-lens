import Button from 'antd/es/button'
import Image from 'antd/es/image'
import message from 'antd/es/message'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { DEFAULT_AVATAR, useAccount } from '~/account'
import { followUser, unfollowUser } from '~/api/booth/follow'
import { NewUserInfo } from '~/api/booth/types'
import { getShortAddress } from '~/utils/format'

type UserInfoDeschoolProps = NewUserInfo & {
  followerDetail?: () => void,
  followingDetail?: () => void,
}

const UserInfoDeschool: React.FC<UserInfoDeschoolProps> = (props) => {
  const { id, avatar, address, displayName, bio, isFollowing, followerCount, followingCount, followerDetail, followingDetail } = props
  const { t } = useTranslation()
  const user = useAccount()
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    if (!user?.id) {
      message.error('Please first login')
      return
    }
    setLoading(true)
    await followUser(id, user?.id)
    setLoading(false)
    message.success(`success following ${address}`)
  }

  const handleUnfollow = async () => {
    if (!user?.id) {
      message.error('Please first login')
      return
    }
    setLoading(true)
    await unfollowUser(id, user?.id)
    setLoading(false)
    message.success(`success unfollow ${address}`)
  }

  return (
    <>
      <div className='mx-auto fcc-center mb-8'>
        <div className="relative frc-center ml-24px mt-24px mb-4">
          {avatar ? (
            <Image
              preview={false}
              alt="user avatar"
              className="w-86px! h-86px! mb-4px rounded-full"
              src={avatar}
              fallback={DEFAULT_AVATAR}
              style={{ display: 'inline-block' }}
            />
          ) : (
            <Jazzicon diameter={86} seed={Math.floor(Math.random() * 1000)} />
          )}
          <svg className="absolute bottom-0" width="92" height="48" viewBox="0 0 92 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90 2C90 26.3005 70.3005 46 46 46C21.6995 46 2 26.3005 2 2" stroke="#774FF8" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="font-Anton text-black text-24px leading-32px h-32px line-wrap two-line-wrap">
          {displayName === address ? getShortAddress(address) : displayName}
        </h1>
      </div>
      {/* follows info */}
      <div className="mx-auto frc-center gap-8 flex-wrap">
        <a
          className={`${followerCount && followerCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followerDetail && followerDetail()
          }}
        >
          <span className="text-black">{followerCount || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
        </a>
        <a
          className={`${followingCount && followingCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followingDetail && followingDetail()
          }}
        >
          <span className="text-black">{followingCount || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
        </a>
      </div>
      <p className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-120px line-wrap three-line-wrap">
        {bio}
      </p>
      <Button type='primary' className='mx-auto px-8' loading={loading} disabled={loading} onClick={!isFollowing ? handleFollow : handleUnfollow}>{!isFollowing ? 'Follow' : 'Unfollow'}</Button>
    </>
  )
}

export default UserInfoDeschool
