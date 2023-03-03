import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import Image from 'antd/es/image'
import fallbackImage from '~/assets/images/fallbackImage'
import { getShortAddress } from '~/utils/format'
import { useAccount } from '~/context/account'
import { useTranslation } from 'react-i18next'
import FollowersModal from './cyberConnecdCardModal'
import type { CyberProfile } from '~/lib/types/app'
import LensAvatar from './avatar'
import SwitchIdentity from './switchIdentity'
import useFollow from '~/hooks/useCyberConnectFollow'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import { GET_FOLLOWER_BY_HANDLE } from '~/api/cc/graphql/GetFollowersByHandle'
import { useLazyQuery } from '@apollo/client'
import { GET_FOLLOWING_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingsByAddressEVM'
import { PRIMARY_PROFILE } from '~/api/cc/graphql'
import { ICyberFollowers, ICyberFollowings } from '~/lib/types/cyberConnect'
import message from 'antd/es/message'

type CyberCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
  visible: boolean
  setProfileType: Dispatch<SetStateAction<string>>
  profileType: string
}

// 0-自己访问自己 1-自己访问别人
const CyberCard = (props: CyberCardProps) => {
  const { visible, visitCase, routeAddress, setProfileType, profileType } = props
  const { cyberToken, cyberProfile } = useAccount()
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const [currentUser, setCurrentUser] = useState<CyberProfile | null>()
  const [updateTrigger, setUpdateTrigger] = useState(0) // 此页面局部刷新
  const [getFollowingByHandle] = useLazyQuery(GET_FOLLOWER_BY_HANDLE)
  const [getFollowingByAddressEVM] = useLazyQuery(GET_FOLLOWING_BY_ADDRESS_EVM)
  const [getPrimaryProfile] = useLazyQuery(PRIMARY_PROFILE);
  const { t } = useTranslation()
  const { follow } = useFollow();
  const { unFollow } = useUnFollow();
  const [isFollowLoaindg, setIsFollowLoading] = useState(false)
  const [followersInfo, setFollowersInfo] = useState<ICyberFollowers>({followerCount:  0, isFollowedByMe: false})
  const [followingsInfo, setFollowingsInfo] = useState<ICyberFollowings>({followingCount: 0})

  // 获取用户的关注者
  const initUserFollowersInfo = async (handle: string, address: string) => {
    const resp = await getFollowingByHandle({
      variables: {
        handle,
        me: address,
      }
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
        address
      }
    })
    setFollowingsInfo({
      followingCount: resp?.data?.address?.followingCount || 0
    })
  }

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    setLoading(true)
    let currentUserHandle = cyberProfile?.handle
    try {
      switch (visitCase) {
        // 访问自己的空间
        case 0:
          setCurrentUser(cyberProfile)
          break
        // 访问他人的空间
        case 1: {
          const res = await getPrimaryProfile({
            variables: {
              address: routeAddress,
              me: cyberToken?.address
            },
          });
          const userInfo = res?.data?.address?.wallet?.primaryProfile
          // 此人没有handle，cyber没数据
          if (!userInfo) {
            setCurrentUser({} as CyberProfile)
            return
          }
          // 此人有数据
          setCurrentUser(userInfo)
          currentUserHandle = userInfo.handle
          break
        }
        default:
          break
      }
      // 获取关注者信息
      initUserFollowersInfo(currentUserHandle, routeAddress || cyberToken?.address!)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setModal({ type: 'followers', visible: false })
  }, [routeAddress])

  useEffect(() => {
    initUserInfo()
    initUserFollowingsInfo(routeAddress || cyberToken?.address!)
    if (updateTrigger > 0) {
      setModal({
        type: 'followers',
        visible: false,
      })
    }
  }, [visitCase, routeAddress, updateTrigger, cyberProfile])

  const handleJumpFollowers = (num: number | undefined) => {
    if (num && num > 0) {
      setModal({
        type: 'followers',
        visible: true,
      })
    }
  }
  const handleJumpFollowing = (num: number | undefined) => {
    if (num && num > 0) {
      setModal({
        type: 'following',
        visible: true,
      })
    }
  }

  const closeModal = () => {
    setModal({
      type: modal.type,
      visible: false,
    })
  }

  const handleFollow = async () => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    const result = await follow(cyberToken?.address!, currentUser?.handle)
    setIsFollowLoading(false)
    console.log('result', result)
    // 关注成功后，刷新页面
    setUpdateTrigger(updateTrigger + 1)
  };

  const handleUnfollow = async () => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    const result = await unFollow(cyberToken?.address!, currentUser?.handle)
    setIsFollowLoading(false)
    console.log('result', result)
    // 关注成功后，刷新页面
    setUpdateTrigger(updateTrigger + 1)
  };

  return (
    <div className={`w-full pb-1 shadow-md rounded-xl ${loading || !visible ? 'hidden' : ''}`}>
      <div className="relative w-full frc-center">
        <SwitchIdentity profileType={profileType} setProfileType={setProfileType} />
        <Image
          preview={false}
          src="https://deschool.s3.amazonaws.com/booth/Booth-logos.jpeg"
          fallback={fallbackImage}
          alt="cover"
          className="h-60! object-cover! object-center! rounded-t-xl"
          wrapperClassName="w-full"
          crossOrigin="anonymous"
        />
        <LensAvatar avatarUrl={currentUser?.avatar} />
      </div>
      {/* 处理数据为空的情况 */}
      <div className="mt-70px w-full px-6 pb-6 fcc-center font-ArchivoNarrow">
        <span className="text-xl">
          {currentUser?.name || (routeAddress ? getShortAddress(routeAddress) : getShortAddress(cyberToken?.address))}
        </span>
        <span className="text-xl text-gray-5">{currentUser?.handleStr ? `@${currentUser?.handleStr}` : 'CyberConnect Handle Not Found'}</span>
      </div>
      <div className="mx-10 frc-center flex-wrap">
        <a
          className={`${
            followersInfo.followerCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
          } text-xl mr-4 `}
          onClick={() => {
            handleJumpFollowers(followersInfo.followerCount)
          }}
        >
          <span className="text-black">{followersInfo.followerCount || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
        </a>
        <a
          className={`${
            followingsInfo?.followingCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
          } text-xl`}
          onClick={() => {
            handleJumpFollowing(followingsInfo?.followingCount)
          }}
        >
          <span className="text-black">{followingsInfo?.followingCount || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
        </a>
      </div>
      {cyberProfile?.handle ? (
        <p className="m-10 text-xl line-wrap three-line-wrap">
          {currentUser?.bio || visitCase === 0 ? '' : "The user hasn't given a bio on CyberConnect for self yet :)"}
        </p>
      ) : (
        <p className="m-10 text-xl three-line-wrap">
          Please get a CyberConnect handle to enable all Booth profile functions. You can grab one at:
          <a href="https://opensea.io/collection/cyberconnect" className="block underline">
            https://opensea.io/collection/cyberconnect
          </a>
        </p>
      )}
      {routeAddress && routeAddress !== cyberToken?.address && (
        <div className="m-10 text-right">
          <button
            type="button"
            className={`${
              currentUser?.handle
                ? 'purple-border-button'
                : 'inline-flex items-center border border-gray rounded-xl bg-gray-3 text-gray-6 hover:cursor-not-allowed'
            } px-2 py-1`}
            disabled={!currentUser?.handle}
            onClick={() => {
              if (currentUser?.isFollowedByMe) {
                handleUnfollow()
              } else {
                handleFollow()
              }
            }}
          >
            {currentUser?.isFollowedByMe ? t('UnFollow') : t('Follow')}
          </button>
        </div>
      )}
      <FollowersModal
        routeAddress={routeAddress || cyberToken?.address}
        profileId={currentUser?.id}
        type={modal.type}
        visible={modal.visible}
        closeModal={closeModal}
      />
    </div>
  )
}

export default CyberCard
