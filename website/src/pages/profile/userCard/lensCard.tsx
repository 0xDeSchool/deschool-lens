import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import Image from 'antd/es/image'
import message from 'antd/es/message'
import fallbackImage from '~/assets/images/fallbackImage'
import { getShortAddress } from '~/utils/format'
import { followByProfileIdWithLens } from '~/api/lens/follow/follow'
import { unfollowByProfileIdWithLens } from '~/api/lens/follow/unfollow'
import { fetchUserDefaultProfile, getExtendProfile } from '~/hooks/profile'
import { useAccount } from '~/context/account'
import { useTranslation } from 'react-i18next'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import FollowersModal from './modal'
import type { ProfileExtend } from '~/lib/types/app'
import LensAvatar from './avatar'
import SwitchIdentity from './switchIdentity'

type LensCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

// 0-自己访问自己 1-自己访问别人
const LensCard = (props: LensCardProps) => {
  const { visitCase, routeAddress } = props
  const { lensToken, lensProfile } = useAccount()
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const [currentUser, setCurrentUser] = useState<ProfileExtend | null>()
  const [updateTrigger, setUpdateTrigger] = useState(0) // 此页面局部刷新
  const { t } = useTranslation()

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    setLoading(true)
    try {
      switch (visitCase) {
        // 访问自己的空间
        case 0:
          setCurrentUser(lensProfile)
          break
        // 访问他人的空间
        case 1: {
          const userInfo = await fetchUserDefaultProfile(routeAddress!) // 此case下必不为空
          // 此人没有handle，lens没数据
          if (!userInfo) {
            setCurrentUser({} as ProfileExtend)
          }
          // 此人有数据
          else {
            const extendUserInfo = getExtendProfile(userInfo)
            setCurrentUser(extendUserInfo)
          }
          break
        }
        default:
          break
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
  }, [visitCase, routeAddress, updateTrigger, lensProfile])

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

  const handleFollow = async (followUser: ProfileExtend | undefined | null) => {
    // 有 lens handle
    if (lensProfile?.handle) {
      const tx = await followByProfileIdWithLens(followUser?.id)
      message.success(`success following ${followUser?.handle},tx is ${tx}`)
      setUpdateTrigger(new Date().getTime())
    }
    // 登录了lens 没有lens handle
    else if (lensToken) {
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

  const handleUnFollow = async (followUser: ProfileExtend | undefined | null) => {
    const tx = await unfollowByProfileIdWithLens(followUser?.id)
    message.success(`success unfollow ${followUser?.handle},tx is ${tx}`)
    setUpdateTrigger(new Date().getTime())
  }

  return (
    <div>
      {/* 处理数据为空的情况 */}
      <div className="mt-70px w-full px-6 pb-6 fcc-center font-ArchivoNarrow">
        <span className="text-xl">
          {currentUser?.name || (routeAddress ? getShortAddress(routeAddress) : getShortAddress(lensToken?.address))}
        </span>
        <span className="text-xl text-gray-5">{currentUser?.handle ? `@${currentUser?.handle}` : 'Lens Handle Not Found'}</span>
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
      {lensProfile?.handle ? (
        <p className="m-10 text-xl line-wrap three-line-wrap">
          {currentUser?.bio || visitCase === 0 ? '' : "The user hasn't given a bio on Lens for self yet :)"}
        </p>
      ) : (
        <p className="m-10 text-xl three-line-wrap">
          Please get a Lens handle to enable all Booth profile functions. You can grab one at:
          <a href="https://opensea.io/collection/lens-protocol-profiles" className="block underline">
            https://opensea.io/collection/lens-protocol-profiles
          </a>
        </p>
      )}
      {routeAddress && routeAddress !== lensToken?.address && (
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
                handleUnFollow(currentUser)
              } else {
                handleFollow(currentUser)
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

export default LensCard
