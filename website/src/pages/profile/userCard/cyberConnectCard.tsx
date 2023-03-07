import { useEffect, useState } from 'react'
import { getShortAddress } from '~/utils/format'
import { useTranslation } from 'react-i18next'
import useFollow from '~/hooks/useCyberConnectFollow'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import { GET_FOLLOWER_BY_HANDLE } from '~/api/cc/graphql/GetFollowersByHandle'
import { useLazyQuery } from '@apollo/client'
import { GET_FOLLOWING_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingsByAddressEVM'
import { PRIMARY_PROFILE } from '~/api/cc/graphql'
import type { ICyberFollowers, ICyberFollowings } from '~/lib/types/cyberConnect'
import message from 'antd/es/message'
import { useAccount } from '~/account'
import type { UserPlatform } from '~/api/booth/types'
import CreateCyberConnectProfile from './createCCProfile'
import FollowersModal from './cyberConnecdCardModal'
import Skeleton from 'antd/es/skeleton'

type CyberCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

// 0-自己访问自己 1-自己访问别人
const CyberCard = (props: CyberCardProps) => {
  const { visitCase, routeAddress } = props
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const user = useAccount()
  const cyberProfile = user?.ccProfile()
  const [currentUser, setCurrentUser] = useState<UserPlatform | undefined>(user?.ccProfile())
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
              me: user?.address,
            },
          });
          const userInfo = res?.data?.address?.wallet?.primaryProfile
          // 此人没有handle，cyber没数据
          if (!userInfo) {
            setCurrentUser({} as UserPlatform)
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
      if (currentUserHandle) {
        await initUserFollowersInfo(currentUserHandle, routeAddress || user?.address!)
        await initUserFollowingsInfo(routeAddress || user?.address!)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setModal({ type: 'followers', visible: false })
  }, [routeAddress])

  useEffect(() => {
    initUserInfo()
    if (updateTrigger > 0) {
      setModal({
        type: 'followers',
        visible: false,
      })
    }
  }, [visitCase, routeAddress, updateTrigger, user?.address!])

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
    const result = await follow(user?.address!, currentUser?.handle!)
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
    const result = await unFollow(user?.address!, currentUser?.handle!)
    setIsFollowLoading(false)
    console.log('result', result)
    // 关注成功后，刷新页面
    setUpdateTrigger(updateTrigger + 1)
  };

  if (loading) {
    return (
      <div className="h-400px fcc-center">
        <Skeleton />
      </div>
    )
  }

  return (
    <div>
      {/* 处理数据为空的情况 */}
      <div className="mt-70px w-full px-6 pb-6 fcc-center font-ArchivoNarrow">
        <span className="text-xl">
          {user?.displayName || (routeAddress ? getShortAddress(routeAddress) : getShortAddress(user?.address))}
        </span>
        <span className="text-xl text-gray-5">{currentUser?.handle ? `@${currentUser?.handle}` : 'CyberConnect Handle Not Found'}</span>
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
          {user?.bio || visitCase === 0 ? '' : "The user hasn't given a bio on CyberConnect for self yet :)"}
        </p>
      ) : (
        <>
         {!cyberProfile?.handle && <CreateCyberConnectProfile />}
          <p className="m-10 text-xl three-line-wrap">
            Please get a CyberConnect handle to enable all Booth profile functions. You can grab one at:
            <a href="https://opensea.io/collection/cyberconnect" className="block underline">
              https://opensea.io/collection/cyberconnect
            </a>
          </p>
        </>
      )}
      {visitCase === 1 && (
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
              if (followersInfo?.isFollowedByMe) {
                handleUnfollow()
              } else {
                handleFollow()
              }
            }}
          >
            {followersInfo?.isFollowedByMe ? t('UnFollow') : t('Follow')}
          </button>
        </div>
      )}
      <FollowersModal
        routeAddress={routeAddress || user?.address}
        type={modal.type}
        visible={modal.visible}
        closeModal={closeModal}
      />
    </div>
  )
}

export default CyberCard
