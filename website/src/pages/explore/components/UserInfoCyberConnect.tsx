import { useLazyQuery } from '@apollo/client'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import message from 'antd/es/message'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { DEFAULT_AVATAR, useAccount } from '~/account'
import { NewUserInfo, UserPlatform } from '~/api/booth/types'
import { PRIMARY_PROFILE } from '~/api/cc/graphql'
import { GET_FOLLOWER_BY_HANDLE } from '~/api/cc/graphql/GetFollowersByHandle'
import { GET_FOLLOWING_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingsByAddressEVM'
import useFollow from '~/hooks/useCyberConnectFollow'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import { ICyberFollowers, ICyberFollowings } from '~/lib/types/cyberConnect'
import { getShortAddress } from '~/utils/format'

type UserInfoCyberConnectProps = NewUserInfo & {
  followerDetail?: () => void,
  followingDetail?: () => void,
}

const UserInfoCyberConnect: React.FC<UserInfoCyberConnectProps> = (props) => {
  const { avatar, address, displayName, bio, isFollowing, followerDetail, followingDetail } = props
  const { t } = useTranslation()
  const { follow } = useFollow();
  const { unFollow } = useUnFollow();
  const [followersInfo, setFollowersInfo] = useState<ICyberFollowers>({followerCount:  0, isFollowedByMe: false})
  const [followingsInfo, setFollowingsInfo] = useState<ICyberFollowings>({followingCount: 0})
  const [getFollowingByHandle] = useLazyQuery(GET_FOLLOWER_BY_HANDLE)
  const [getFollowingByAddressEVM] = useLazyQuery(GET_FOLLOWING_BY_ADDRESS_EVM)
  const [getPrimaryProfile] = useLazyQuery(PRIMARY_PROFILE);
  const [currentUser, setCurrentUser] = useState<UserPlatform>()
  const [loading, setLoading] = useState(false)
  const [isFollowLoaindg, setIsFollowLoading] = useState(false)
  const user = useAccount()

  // 获取用户的关注者
  const initUserFollowersInfo = async (handle: string, address: string) => {
    const resp = await getFollowingByHandle({
      variables: {
        handle,
        me: address,
      },
    })
    const primaryProfile = resp?.data?.profileByHandle
    console.log('primaryProfile', primaryProfile)
    setFollowersInfo({
      followerCount: primaryProfile?.followerCount || 0,
      isFollowedByMe: primaryProfile?.isFollowedByMe || false,
    })
  }

  // 获取用户的关注的人
  const initUserFollowingsInfo = async (address: string) => {
    const resp = await getFollowingByAddressEVM({
      variables: {
        address,
      },
    })
    setFollowingsInfo({
      followingCount: resp?.data?.address?.followingCount || 0,
    })
  }

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await getPrimaryProfile({
        variables: {
          address,
          me: user?.address,
        },
      });
      const userInfo = res?.data?.address?.wallet?.primaryProfile
      // 此人没有handle，cyber没数据
      if (!userInfo) {
        setCurrentUser({} as UserPlatform)
        return
      }
      userInfo.handle = userInfo?.handle
      // 此人有数据
      setCurrentUser(userInfo)
      if (userInfo.handle) {
        initUserFollowersInfo(userInfo.handle, address)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initUserInfo()
    initUserFollowingsInfo(address)
  }, [address])

  const handleFollow = async () => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    await follow(user?.address!, currentUser?.handle!)
    setIsFollowLoading(false)
    // 关注成功后，刷新页面
  };

  const handleUnfollow = async () => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    await unFollow(user?.address!, currentUser?.handle!)
    setIsFollowLoading(false)
    // 关注成功后，刷新页面
  };

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
          className={`${followersInfo.followerCount && followersInfo.followerCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followerDetail && followerDetail()
          }}
        >
          <span className="text-black">{followersInfo.followerCount || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
        </a>
        <a
          className={`${followingsInfo.followingCount && followingsInfo.followingCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followingDetail && followingDetail()
          }}
        >
          <span className="text-black">{followingsInfo.followingCount || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
        </a>
      </div>
      <p className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-120px line-wrap three-line-wrap">
        {bio}
      </p>
      <Button type='primary' className='mx-auto px-8' loading={isFollowLoaindg} disabled={!currentUser?.handle || isFollowLoaindg} onClick={!isFollowing ? handleFollow : handleUnfollow}>{!isFollowing ? 'Follow' : 'Unfollow'}</Button>
    </>
  )
}

export default UserInfoCyberConnect
