import { useEffect, useState } from 'react'
import message from 'antd/es/message'
import { getShortAddress } from '~/utils/format'
import { followByProfileIdWithLens } from '~/api/lens/follow/follow'
import { unfollowByProfileIdWithLens } from '~/api/lens/follow/unfollow'
import { fetchUserDefaultProfile, getExtendProfile } from '~/hooks/profile'
import { useTranslation } from 'react-i18next'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import { useAccount } from '~/account'
import type { UserPlatform } from '~/api/booth/types'
import { PlatformType } from '~/api/booth/booth'
import FollowersModal from './modal'
import Skeleton from 'antd/es/skeleton'
import Button from 'antd/es/button'

type LensCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

// 0-自己访问自己 1-自己访问别人
const LensCard = (props: LensCardProps) => {
  const { visitCase, routeAddress } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const [updateTrigger, setUpdateTrigger] = useState(0) // 此页面局部刷新
  const [currentUser, setCurrentUser] = useState<UserPlatform | null>()
  const [isFollowedByMe, setIsFollowedByMe] = useState(false) // 是否被我关注
  const [totalFollowers, setTotalFollowers] = useState(0) // 粉丝数
  const [totalFollowing, setTotalFollowing] = useState(0) // 关注数
  const user = useAccount()
  const lensProfile = user?.lensProfile()

  // 重置用户信息
  const resetUserInfo = () => {
    setCurrentUser(null)
    setIsFollowedByMe(false)
    setTotalFollowers(0)
    setTotalFollowing(0)
  }

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    setLoading(true)
    try {
      // 每次展示都应该获取当前 address 下最新数据
      let address = user?.address
      if (visitCase === 1) {
        address = routeAddress
      }
      if (!address) {
        resetUserInfo()
        return
      }
      const userInfo = await fetchUserDefaultProfile(address!) // 此case下必不为空
      // 此人没有handle，lens没数据
      if (!userInfo) {
        setCurrentUser({} as UserPlatform)
        return
      }
      // 此人有数据
      const extendUserInfo = getExtendProfile(userInfo)
      // 默认展示地址缩写
      let displayName = getShortAddress(address!)
      // 如果是用户自己，则展示用户名
      if (visitCase === 0) {
          displayName = user?.displayName!
      }
      // 根据最新用户信息结构更新当前用户信息
      setCurrentUser({
        handle: extendUserInfo?.handle,
        address: address!,
        displayName,
        platform: PlatformType.LENS,
        data: {
          id: extendUserInfo?.id,
        },
      })
      setIsFollowedByMe(extendUserInfo?.isFollowedByMe)
      setTotalFollowers(extendUserInfo?.stats?.totalFollowers || 0)
      setTotalFollowing(extendUserInfo?.stats?.totalFollowing || 0)
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
  }, [visitCase, updateTrigger, user?.address])

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

  const handleFollow = async (followUser: UserPlatform | undefined | null) => {
    // 有 lens handle
    if (lensProfile?.handle) {
      const tx = await followByProfileIdWithLens(followUser?.data?.id!)
      message.success(`success following ${followUser?.handle},tx is ${tx}`)
      setUpdateTrigger(new Date().getTime())
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

  const handleUnFollow = async (followUser: UserPlatform | undefined | null) => {
    const tx = await unfollowByProfileIdWithLens(followUser?.data?.id!)
    message.success(`success unfollow ${followUser?.handle},tx is ${tx}`)
    setUpdateTrigger(new Date().getTime())
  }

  if (loading) {
    return (
      <div className="h-400px fcc-center">
        <Skeleton active/>
      </div>
    )
  }

  return (
    <div>
      {/* 处理数据为空的情况 */}
      <div className="mt-70px w-full px-6 pb-6 fcc-center font-ArchivoNarrow">
        <span className="text-xl">
          {currentUser?.displayName}
        </span>
        <span className="text-xl text-gray-5">{currentUser?.handle ? `@${currentUser?.handle}` : 'Lens Handle Not Found'}</span>
      </div>
      <div className="mx-10 frc-center flex-wrap">
        <a
          className={`${
            totalFollowers > 0 ? 'hover:underline hover:cursor-pointer' : ''
          } text-xl mr-4 `}
          onClick={() => {
            handleJumpFollowers(totalFollowers)
          }}
        >
          <span className="text-black">{totalFollowers || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
        </a>
        <a
          className={`${
            totalFollowing > 0 ? 'hover:underline hover:cursor-pointer' : ''
          } text-xl`}
          onClick={() => {
            handleJumpFollowing(totalFollowing)
          }}
        >
          <span className="text-black">{totalFollowing || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
        </a>
      </div>
      {currentUser?.handle ? (
        <p className="m-10 text-xl line-wrap three-line-wrap">
          {user?.bio || visitCase === 0 ? '' : "The user hasn't given a bio on Lens for self yet :)"}
        </p>
      ) : (
        <p className="m-10 text-xl three-line-wrap">
          Please get a Lens handle to enable all Booth profile functions. You can grab one at:
          <a href="https://opensea.io/collection/lens-protocol-profiles" className="block underline">
            https://opensea.io/collection/lens-protocol-profiles
          </a>
        </p>
      )}
      {visitCase === 1 && (
        <div className="m-10 text-right">
          <Button
            className={`${
              currentUser?.handle
                ? 'purple-border-button'
                : 'inline-flex items-center border border-gray rounded-xl bg-gray-3 text-gray-6 hover:cursor-not-allowed'
            } px-2 py-1`}
            disabled={!currentUser?.handle || !user?.address}
            onClick={() => {
              if (isFollowedByMe) {
                handleUnFollow(currentUser)
              } else {
                handleFollow(currentUser)
              }
            }}
          >
            {isFollowedByMe ? t('UnFollow') : t('Follow')}
          </Button>
        </div>
      )}
      <FollowersModal
        routeAddress={routeAddress}
        profileId={currentUser?.data?.id}
        type={modal.type}
        visible={modal.visible}
        closeModal={closeModal}
      />
    </div>
  )
}

export default LensCard
