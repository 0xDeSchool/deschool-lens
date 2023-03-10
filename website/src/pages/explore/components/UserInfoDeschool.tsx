import Button from 'antd/es/button'
import Image from 'antd/es/image'
import message from 'antd/es/message'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_AVATAR, useAccount } from '~/account'
import { getLatestUsers } from '~/api/booth'
import { followUser, unfollowUser } from '~/api/booth/follow'
import { NewUserInfo } from '~/api/booth/types'
import { getShortAddress } from '~/utils/format'
import UserInfoSkeleton from './UserInfoSkeleton'

type UserInfoDeschoolProps = NewUserInfo & {
  followerDetail?: () => void,
  followingDetail?: () => void,
  refresh: () => void,
}

const UserInfoDeschool: React.FC<UserInfoDeschoolProps> = (props) => {
  const { id, avatar, address, displayName, bio, isFollowing, followerCount, followingCount, followerDetail, followingDetail, refresh } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAccount()
  const [loading, setLoading] = useState(true)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [currentFollowerCount, setcurrentFollowerCount] = useState(followerCount)
  const [following, setFollowing] = useState(isFollowing)

  useEffect(() => {
    setLoading(false)
  }, [address])

  const updateFollowStatus = async () => {
    const u = await getLatestUsers({ userId: id })
    if (u.items.length > 0) {
      setcurrentFollowerCount(u.items[0].followerCount)
      setFollowing(u.items[0].isFollowing)
    }
  }

  const handleFollow = async () => {
    if (!user?.id) {
      message.warning('Please first login')
      return
    }
    setIsFollowLoading(true)
    await followUser(id, user?.id)
    await updateFollowStatus()
    setIsFollowLoading(false)
    message.success(`success following ${address}`)
  }

  const handleUnfollow = async () => {
    if (!user?.id) {
      message.error('Please first login')
      return
    }
    setIsFollowLoading(true)
    await unfollowUser(id, user?.id)
    await updateFollowStatus()
    setIsFollowLoading(false)
    message.success(`success unfollow ${address}`)
  }

  const handleJumpProfile = () => {
    navigate(`/profile/${address}/resume`)
  }

  if (loading) return <UserInfoSkeleton />

  return (
    <>
      <div className='mx-auto fcc-center mb-8'>
        <div className="relative frc-center mt-24px mb-4">
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
          className={`${currentFollowerCount && currentFollowerCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followerDetail && followerDetail()
          }}
        >
          <span className="text-black">{currentFollowerCount || '-'} </span>
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
      <p className="mt-4 mx-auto font-ArchivoNarrow text-#000000d8 text-16px align-center leading-24px h-80px line-wrap three-line-wrap">
        {bio || "The user hasn't given a bio for self yet :)"}
      </p>
      {<div className='frc-between gap-8 mx-auto'>
        <Button
          className='w-120px frc-center purple-border-button px-2 py-1 font-ArchivoNarrow'
          style={{ color: following ? '' : 'white' }}
          type={!following ? 'primary' : 'default'}
          loading={isFollowLoading}
          disabled={isFollowLoading || !user || user.address === address}
          onClick={!following ? handleFollow : handleUnfollow}>{!following ? 'Follow' : 'Unfollow'}
        </Button>
        <Button className='w-120px frc-center purple-border-button px-2 py-1 font-ArchivoNarrow' onClick={handleJumpProfile}> {t('LearnMore')}</Button>
      </div>}
    </>
  )
}

export default UserInfoDeschool
