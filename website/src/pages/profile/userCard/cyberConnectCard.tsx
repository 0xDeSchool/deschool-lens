import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import Image from 'antd/es/image'
import fallbackImage from '~/assets/images/fallbackImage'
import { getShortAddress } from '~/utils/format'
import { fetchUserDefaultProfile, getExtendProfile } from '~/hooks/profile'
import { useAccount } from '~/context/account'
import { useTranslation } from 'react-i18next'
import FollowersModal from './cyberConnecdCardModal'
import type { ProfileExtend } from '~/lib/types/app'
import LensAvatar from './avatar'
import SwitchIdentity from './switchIdentity'
import useFollow from '~/hooks/useCyberConnectFollow'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import { GET_FOLLOWING_BY_HANDLE } from '~/api/cc/graphql/GetFollowingsByHandle'
import { useLazyQuery } from '@apollo/client'
import { GET_FOLLOWING_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingsByAddressEVM'
import { PRIMARY_PROFILE } from '~/api/cc/graphql'


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
  const [currentUser, setCurrentUser] = useState<ProfileExtend | null>()
  const [updateTrigger, setUpdateTrigger] = useState(0) // 此页面局部刷新
  const [getFollowingByHandle] = useLazyQuery(GET_FOLLOWING_BY_HANDLE)
  const [getFollowingByAddressEVM] = useLazyQuery(GET_FOLLOWING_BY_ADDRESS_EVM)
  const [getPrimaryProfile] = useLazyQuery(PRIMARY_PROFILE);
  const { t } = useTranslation()
  const { follow } = useFollow();
  const { unFollow } = useUnFollow();
  const [isFollowLoaindg, setIsFollowLoading] = useState(false)

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    setLoading(true)
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
            setCurrentUser({} as ProfileExtend)
            return
          }
          // 此人有数据
          const extendUserInfo = getExtendProfile(userInfo)
          setCurrentUser(extendUserInfo)
          break
        }
        default:
          break
      }
    } finally {
      setLoading(false)
    }
  }

  const initFollowsRelationship = async () => {
    const getFollowings = async () => {
      const resp1 = await getFollowingByHandle({
        variables: {
          "handle": "shiyu",
          "me": "0xD790D1711A9dCb3970F47fd775f2f9A2f0bCc348"
        }
      })
    }
    const result = await getFollowings()
    console.log('result', result)
  }

  useEffect(() => {
    setModal({ type: 'followers', visible: false })
  }, [routeAddress])

  useEffect(() => {
    initUserInfo()
    initFollowsRelationship()
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

  // 需要在这里处理一下handle，因为cyber的handle是带有.cc的
  const parseHanlde = (val: string) => {
    return val.split('.cc')[0]
  }

  const handleFollow = async () => {
    setIsFollowLoading(true)
    const result = await follow(cyberToken?.address!, parseHanlde(currentUser?.handle))
    setIsFollowLoading(false)
    console.log('result', result)
  };

  const handleUnfollow = async () => {
    setIsFollowLoading(true)
    const result = await unFollow(cyberToken?.address!, currentUser?.handle)
    setIsFollowLoading(false)
    console.log('result', result)
  };

  return (
    <div className={`w-full pb-1 shadow-md rounded-xl ${loading || !visible ? 'hidden' : ''}`}>
      <div className="relative w-full frc-center">
        <SwitchIdentity profileType={profileType} setProfileType={setProfileType} />
        {currentUser?.coverUrl ? (
          <Image
            preview={false}
            src={currentUser.coverUrl}
            fallback={fallbackImage}
            alt="cover"
            className="h-60! object-cover! object-center! rounded-t-xl"
            crossOrigin="anonymous"
          />
        ) : (
          <Image
            preview={false}
            src="https://deschool.s3.amazonaws.com/booth/Booth-logos.jpeg"
            fallback={fallbackImage}
            alt="cover"
            className="h-60! object-cover! object-center! rounded-t-xl"
            wrapperClassName="w-full"
            crossOrigin="anonymous"
          />
        )}
        <LensAvatar avatarUrl={currentUser?.avatarUrl} />
      </div>
      {/* 处理数据为空的情况 */}
      <div className="mt-70px w-full px-6 pb-6 fcc-center font-ArchivoNarrow">
        <span className="text-xl">
          {currentUser?.name || (routeAddress ? getShortAddress(routeAddress) : getShortAddress(cyberToken?.address))}
        </span>
        <span className="text-xl text-gray-5">{currentUser?.handle ? `@${currentUser?.handle}` : 'CyberConnect Handle Not Found'}</span>
      </div>
      <div className="mx-10 frc-center flex-wrap">
        <a
          className={`${
            currentUser?.stats?.totalFollowers && currentUser?.stats?.totalFollowers > 0 ? 'hover:underline hover:cursor-pointer' : ''
          } text-xl mr-4 `}
          onClick={() => {
            handleJumpFollowers(currentUser?.stats?.totalFollowers)
          }}
        >
          <span className="text-black">{currentUser?.stats?.totalFollowers || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
        </a>
        <a
          className={`${
            currentUser?.stats?.totalFollowing && currentUser?.stats?.totalFollowing > 0 ? 'hover:underline hover:cursor-pointer' : ''
          } text-xl`}
          onClick={() => {
            handleJumpFollowing(currentUser?.stats?.totalFollowing)
          }}
        >
          <span className="text-black">{currentUser?.stats?.totalFollowing || '-'} </span>
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
        routeAddress={routeAddress}
        profileId={currentUser?.id}
        type={modal.type}
        visible={modal.visible}
        closeModal={closeModal}
      />
    </div>
  )
}

export default CyberCard
