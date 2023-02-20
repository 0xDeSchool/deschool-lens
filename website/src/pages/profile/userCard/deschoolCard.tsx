import type { Dispatch, SetStateAction } from 'react'
import { useMemo, useEffect, useState } from 'react'

import Jazzicon from 'react-jazzicon'
import message from 'antd/es/message'
import Skeleton from 'antd/es/skeleton'
import { getShortAddress } from '~/utils/format'
import { useAccount } from '~/context/account'
import { useTranslation } from 'react-i18next'
import type { FollowRelationType } from '~/api/booth/follow';
import { getFollowings, getFollowers, followUser, unfollowUser, checkfollowUser } from '~/api/booth/follow'
import { getOtherUsersProfile } from '~/api/go/account'
import type { DeschoolProfile, OtherDeschoolProfile } from '~/lib/types/app'
import LensAvatar from './avatar'
import SwitchIdentity from './switchIdentity'
import DeschoolFollowersModal from './deschoolModal'

type DeschoolCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
  visible: boolean
  setProfileType: Dispatch<SetStateAction<string>>
  profileType: string
}

// 0-自己访问自己 1-自己访问别人
const DeschoolCard = (props: DeschoolCardProps) => {
  const { visible, visitCase, routeAddress, setProfileType, profileType } = props
  const { deschoolProfile } = useAccount()
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const [currentUser, setCurrentUser] = useState<DeschoolProfile | OtherDeschoolProfile | null>(null)
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false)
  const [followings, setFollowings] = useState([])
  const [followers, setFollowers] = useState([])
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const { t } = useTranslation()

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    setLoading(true)
    try {
      switch (visitCase) {
        // 访问自己的空间
        case 0:
          if (deschoolProfile?.address) {
            const resFollowings = await getFollowings(deschoolProfile?.address)
            if (resFollowings) {
              setFollowings(resFollowings)
            }
            const resFollowers = await getFollowers(deschoolProfile?.address)
            if (resFollowers) {
              setFollowers(resFollowers)
            }
            const deschoolProfileExtend = Object.assign(deschoolProfile, {
              stats: { totalFollowers: resFollowers ? resFollowers.length : 0, totalFollowing: resFollowings ? resFollowings.length : 0 },
            })
            setCurrentUser(deschoolProfileExtend)
          }
          break
        // 访问他人的空间
        case 1: {
          // 我登录了
          if (deschoolProfile?.address) {
            const isFollowed: FollowRelationType | any = await checkfollowUser(routeAddress!, deschoolProfile?.address)
            setIsFollowedByMe(isFollowed.fromFollowedTo || false) // 我A(from)=>他人B(to)
          }
          // 没登录
          else {
            setIsFollowedByMe(false)
          }
          const userInfo = await getOtherUsersProfile([routeAddress!]) // 此case下必不为空

          if (userInfo && userInfo.length > 0 && userInfo[0]) {
            const resFollowings = await getFollowings(userInfo[0]?.address, deschoolProfile?.address)
            if (resFollowings) {
              setFollowings(resFollowings)
            }
            const resFollowers = await getFollowers(userInfo[0]?.address, deschoolProfile?.address)
            if (resFollowers) {
              setFollowers(resFollowers)
            }
            const userInfoExtend = Object.assign(userInfo[0], {
              stats: { totalFollowers: resFollowers ? resFollowers.length : 0, totalFollowing: resFollowings ? resFollowings.length : 0 },
            })
            setCurrentUser(userInfoExtend)
          }

          break
        }
        default:
          setIsFollowedByMe(false)
          setFollowers([])
          setFollowings([])
          setCurrentUser(null)
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
  }, [updateTrigger, routeAddress, visitCase, deschoolProfile])

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

  const handleFollow = async (user: DeschoolProfile | OtherDeschoolProfile) => {
    await followUser(user.address, deschoolProfile?.address!)
    message.success(`success following ${user.address}`)
    setUpdateTrigger(new Date().getTime())
  }

  const handleUnFollow = async (user: DeschoolProfile | OtherDeschoolProfile) => {
    await unfollowUser(user.address, deschoolProfile?.address!)
    message.success(`success unfollow ${user?.address}`)
    setUpdateTrigger(new Date().getTime())
  }

  const computedUserName = useMemo(
    () => currentUser?.username || (routeAddress ? getShortAddress(routeAddress) : getShortAddress(deschoolProfile?.address)),
    [currentUser, routeAddress, deschoolProfile],
  )

  return (
    <div className={`w-full pb-1 shadow-md rounded-xl ${!visible ? 'hidden' : ''}`}>
      {loading ? (
        <div className="h-400px fcc-center">
          <Skeleton />
        </div>
      ) : (
        <>
          <div className="relative w-full frc-center">
            <SwitchIdentity profileType={profileType} setProfileType={setProfileType} />
            <div className="h-60 object-cover object-center rounded-t-xl overflow-hidden">
              <Jazzicon paperStyles={{ borderRadius: '10px' }} diameter={400} seed={Math.floor(Math.random() * 30)} />
            </div>
            <LensAvatar avatarUrl={currentUser?.avatar} />
          </div>
          {/* 处理数据为空的情况 */}
          <div className="mt-70px w-full px-6 pb-6 fcc-center font-ArchivoNarrow">
            <span className="text-center text-xl w-200px overflow-hidden text-ellipsis" title={computedUserName}>
              {computedUserName}
            </span>
            <span className="text-xl text-gray-5">{currentUser?.ensName ? `${currentUser?.ensName}` : ''}</span>
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
          <p className="m-10 text-xl line-wrap three-line-wrap">
            {currentUser?.bio || visitCase === 0 ? '' : "The user hasn't given a bio on Lens for self yet :)"}
          </p>
          {routeAddress && routeAddress !== deschoolProfile?.address && (
            <div className="m-10 text-right">
              <button
                type="button"
                className="purple-border-button px-2 py-1"
                onClick={() => {
                  if (isFollowedByMe && currentUser) {
                    handleUnFollow(currentUser)
                  } else if (currentUser) {
                    handleFollow(currentUser)
                  }
                }}
              >
                {isFollowedByMe ? t('UnFollow') : t('Follow')}
              </button>
            </div>
          )}
          <DeschoolFollowersModal
            type={modal.type}
            visible={modal.visible}
            closeModal={closeModal}
            followings={followings}
            followers={followers}
            setUpdateTrigger={setUpdateTrigger}
          />
        </>
      )}
    </div>
  )
}

export default DeschoolCard
