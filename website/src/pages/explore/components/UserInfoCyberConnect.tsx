import Button from 'antd/es/button'
import Image from 'antd/es/image'
import message from 'antd/es/message'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { useNavigate } from 'react-router'
import { DEFAULT_AVATAR, useAccount } from '~/account'
import { NewUserInfo } from '~/api/booth/types'
import useFollow from '~/hooks/useCyberConnectFollow'
import useCyberConnectProfile from '~/hooks/useCyberConnectProfile'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import { getShortAddress } from '~/utils/format'
import UserInfoSkeleton from './UserInfoSkeleton'

type UserInfoCyberConnectProps = NewUserInfo & {
  followerDetail?: () => void,
  followingDetail?: () => void,
}

const UserInfoCyberConnect: React.FC<UserInfoCyberConnectProps> = (props) => {
  const { address, followerDetail, followingDetail } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { follow } = useFollow();
  const { unFollow } = useUnFollow();
  const [isFollowLoaindg, setIsFollowLoading] = useState(false)
  const user = useAccount()
  const { userProfile, followerCount, followingCount, isFollowedByMe, userLoading, fetchUserInfo, refreshFollowInfo } = useCyberConnectProfile()


  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    fetchUserInfo(address, user?.address!)
  }

  useEffect(() => {
    initUserInfo()
  }, [address])

  const handleFollow = async () => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    await follow(userProfile?.handle!)
    setIsFollowLoading(false)
    // 关注成功后，刷新页面
    await refreshFollowInfo(userProfile.handle!);
  };

  const handleUnfollow = async () => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    await unFollow(userProfile?.handle!)
    setIsFollowLoading(false)
    // 关注成功后，刷新页面
    await refreshFollowInfo(userProfile.handle!)
  };

  const handleJumpProfile = () => {
    navigate(`/profile/${address}/resume`)
  }

  if (userLoading) return <UserInfoSkeleton />

  return (
    <>
      <div className='mx-auto fcc-center mb-8'>
        <div className="relative frc-center mt-24px mb-4">
          {userProfile?.avatar ? (
            <Image
              preview={false}
              alt="user avatar"
              className="w-86px! h-86px! mb-4px rounded-full"
              src={userProfile?.avatar}
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
          {userProfile?.displayName || userProfile?.handle || getShortAddress(address)}
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
      <p className="mt-4 mx-auto font-ArchivoNarrow text-#000000d8 text-16px align-center leading-24px h-80px line-wrap three-line-wrap">
        {userProfile?.bio || "The user hasn't given a bio for self yet :)"}
      </p>
      <div className='frc-between gap-8 mx-auto'>
        {/* disabled 用户自己、用户没有handle、正在调用关注中*/}
        <Button
          className='w-120px frc-center purple-border-button px-2 py-1 font-ArchivoNarrow'
          style={{color: !isFollowedByMe ? 'white' : ''}}
          type={!isFollowedByMe ? 'primary' : 'default'}
          loading={isFollowLoaindg} disabled={!userProfile?.handle || !user?.address || (address && address === user?.address) || isFollowLoaindg} onClick={!isFollowedByMe ? handleFollow : handleUnfollow}>{!isFollowedByMe ? 'Follow' : 'Unfollow'}</Button>
        <Button className='w-120px frc-center purple-border-button px-2 py-1 font-ArchivoNarrow' onClick={handleJumpProfile}> {t('LearnMore')}</Button>
      </div>
    </>
  )
}

export default UserInfoCyberConnect
