import { CloseOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import message from 'antd/es/message'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { useNavigate } from 'react-router'
import { DEFAULT_AVATAR, useAccount } from '~/account'
import { NewUserInfo } from '~/api/booth/types'
import { followByProfileIdWithLens } from '~/api/lens/follow/follow'
import { unfollowByProfileIdWithLens } from '~/api/lens/follow/unfollow'
import { fetchUserDefaultProfile, getExtendProfile } from '~/hooks/profile'
import { ProfileExtend } from '~/lib/types/app'
import { getShortAddress } from '~/utils/format'
import UserInfoSkeleton from './UserInfoSkeleton'

type UserInfoLensProps = NewUserInfo & {
  followerDetail?: () => void,
  followingDetail?: () => void,
}

const UserInfoLens: React.FC<UserInfoLensProps> = (props) => {
  const { avatar, address, displayName, bio, followerDetail, followingDetail } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<ProfileExtend | null>(null)
  const [isFollowedByMe, setIsFollowedByMe] = useState(false) // 是否被我关注
  const [totalFollowers, setTotalFollowers] = useState(0) // 粉丝数
  const [totalFollowing, setTotalFollowing] = useState(0) // 关注数
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = useAccount()

  // 重置用户信息
  const resetUserInfo = () => {
    setCurrentUser(null)
    setIsFollowedByMe(false)
    setTotalFollowers(0)
    setTotalFollowing(0)
  }

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    if (loading) return
    setLoading(true)
    try {
      // 每次展示都应该获取当前 address 下最新数据
      const userInfo = await fetchUserDefaultProfile(address!) // 此case下必不为空
      // 此人没有handle，lens没数据
      if (!userInfo) {
        setCurrentUser(null)
        return
      }
      // 此人有数据
      const extendUserInfo = getExtendProfile(userInfo)
      // 默认展示地址缩写
      // 根据最新用户信息结构更新当前用户信息
      setCurrentUser(extendUserInfo)
      setIsFollowedByMe(extendUserInfo?.isFollowedByMe)
      setTotalFollowers(extendUserInfo?.stats?.totalFollowers || 0)
      setTotalFollowing(extendUserInfo?.stats?.totalFollowing || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initUserInfo()
  }, [address])

  const handleFollow = async () => {
    if (isFollowLoading) return
    // 有 lens handle
    const lensProfile = user?.lensProfile()
    if (lensProfile?.handle) {
      setIsFollowLoading(true)
      const tx = await followByProfileIdWithLens(currentUser?.id!)
      setIsFollowLoading(false)
      message.success(`success following ${currentUser?.handle},tx is ${tx}`)
    }
    // 登录了lens 没有lens handle
    else if (!lensProfile?.handle) {
      message.info({
        key: 'nohandle_lenscard',
        content: (
          <p className="inline">
            Visit
            <a className="font-bold mx-2" href="https://claim.lens.xyz" target="_blank" rel="noreferrer noopener">
              claiming site
            </a>
            to claim your profile now 🏃‍♂️
            <CloseOutlined
              size={12}
              className="inline ml-2 hover:color-purple!"
              onClick={() => {
                message.destroy('nohandle_lenscard')
              }}
            />
          </p>
        ),
        duration: 0,
      })
    }
    // 没登录 lens
    else {
      message.warning('Please connect lens first')
    }
  }

  const handleUnfollow = async () => {
    if (isFollowLoading) return
    setIsFollowLoading(true)
    const tx = await unfollowByProfileIdWithLens(currentUser?.id)
    setIsFollowLoading(false)
    message.success(`success unfollow ${currentUser?.handle},tx is ${tx}`)
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
          className={`${totalFollowers && totalFollowers > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followerDetail && followerDetail()
          }}
        >
          <span className="text-black">{totalFollowers || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
        </a>
        <a
          className={`${totalFollowing && totalFollowing > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followingDetail && followingDetail()
          }}
        >
          <span className="text-black">{totalFollowing || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
        </a>
      </div>
      <p className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-120px line-wrap three-line-wrap">
        {bio}
      </p>
      <div className='frc-between gap-8 mx-auto'>
        <Button type='primary' className='mx-auto px-8' loading={isFollowLoading} disabled={isFollowLoading} onClick={!isFollowedByMe ? handleFollow : handleUnfollow}>{!isFollowedByMe ? 'Follow' : 'Unfollow'}</Button>
        <Button className='w-120px' onClick={handleJumpProfile}> {t('LearnMore')}</Button>
      </div>
    </>
  )
}

export default UserInfoLens
