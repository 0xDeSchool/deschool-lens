/**
 * @description 用户相关信息的展示
 * @author victor
 * @exports {UserInfo}
 * @props
 */
import Image from 'antd/es/image'
import message from 'antd/es/message'
import Skeleton from 'antd/es/skeleton'
import { useEffect, useState } from 'react'
import { useAccount } from '~/context/account'
import { fetchUserDefaultProfile, getExtendProfile } from '~/hooks/profile'
import { getAddress } from '~/auth/user'
import { useTranslation } from 'react-i18next'
import fallbackImage from '~/assets/images/fallbackImage'
import { getShortAddress } from '~/utils/format'
import { followByProfileIdWithLens } from '~/api/lens/follow/follow'
import { unfollowByProfileIdWithLens } from '~/api/lens/follow/unfollow'
import FollowersModal from './modal'
import type { ProfileExtend } from '~/lib/types/app'
import LensAvatar from './avatar'

type UserCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  address: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

const UserCard = (props: UserCardProps) => {
  const { visitCase, address } = props
  const { t } = useTranslation()
  const user = useAccount()
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const [currentUser, setCurrentUser] = useState<ProfileExtend | undefined>()

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    setLoading(true)
    try {
      switch (visitCase) {
        // 访问自己的空间
        case 0:
          setCurrentUser(user)
          break
        // 访问他人的空间
        case 1: {
          const userInfo = await fetchUserDefaultProfile(address!) // 此case下必不为空
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
    initUserInfo()
  }, [visitCase])

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
    const tx = await followByProfileIdWithLens(followUser?.id)
    message.success(`success following ${followUser?.handle},tx is ${tx}`)
  }

  const handleUnFollow = async (followUser: ProfileExtend | undefined | null) => {
    const tx = await unfollowByProfileIdWithLens(followUser?.id)
    message.success(`success following ${followUser?.handle},tx is ${tx}`)
  }

  return loading ? (
    <Skeleton />
  ) : (
    <div className={`w-full border shadow-md rounded-xl ${loading ? 'hidden' : ''}`}>
      <div className="relative w-full frc-center">
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
        <span className="text-xl">{currentUser?.name || address ? getShortAddress(address) : getShortAddress(getAddress())}</span>
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
      {user?.handle ? (
        <p className="m-10 text-xl line-wrap three-line-wrap">
          {currentUser?.bio || "The user hasn't given a bio on Lens for self yet :)"}
        </p>
      ) : (
        <p className="m-10 text-xl three-line-wrap">
          Please get a Lens handle to enable all Booth profile functions. You can grab one at:
          <a href="https://opensea.io/collection/lens-protocol-profiles" className="block underline">
            https://opensea.io/collection/lens-protocol-profiles
          </a>
        </p>
      )}

      {address && address !== getAddress() && (
        <div className="m-10">
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
      <FollowersModal address={address} profileId={currentUser?.id} type={modal.type} visible={modal.visible} closeModal={closeModal} />
    </div>
  )
}

export default UserCard
