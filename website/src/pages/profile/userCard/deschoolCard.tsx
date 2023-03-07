import { useEffect, useState } from 'react'

import message from 'antd/es/message'
import Skeleton from 'antd/es/skeleton'
import { useTranslation } from 'react-i18next'
import type { FollowRelationType } from '~/api/booth/follow';
import { getFollowings, getFollowers, followUser, unfollowUser, checkfollowUser } from '~/api/booth/follow'
import { useAccount } from '~/account'
import type { UserInfo } from '~/api/booth/types';
import { getUserInfo } from '~/api/booth';
import { getShortAddress } from '~/utils/format';
import DeschoolFollowersModal from './deschoolModal'

type DeschoolCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

// 0-自己访问自己 1-自己访问别人
const DeschoolCard = (props: DeschoolCardProps) => {
  const { visitCase, routeAddress } = props
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false)
  const [followings, setFollowings] = useState([])
  const [followers, setFollowers] = useState([])
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const { t } = useTranslation()
  const user = useAccount()

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    setLoading(true)
    try {
      switch (visitCase) {
        // 访问自己的空间
        case 0:
          if (user) {
            const resFollowings = await getFollowings(user.id)
            if (resFollowings) {
              setFollowings(resFollowings)
            }
            const resFollowers = await getFollowers(user.id)
            if (resFollowers) {
              setFollowers(resFollowers)
            }
            setCurrentUser(user)
          }
          break
        // 访问他人的空间
        case 1: {
          const userInfo = await getUserInfo(routeAddress) // 此case下必不为空
          if (userInfo) {
            setCurrentUser({
              id: userInfo.id,
              address: userInfo.address,
              avatar: userInfo.avatar,
              bio: userInfo.bio,
              displayName: userInfo.displayName,
            })
            const resFollowings = await getFollowings(userInfo.id, user?.id)
            if (resFollowings) {
              setFollowings(resFollowings)
            }
            const resFollowers = await getFollowers(userInfo.id, user?.id)
            if (resFollowers) {
              setFollowers(resFollowers)
            }

            // 我登录了
            if (user) {
              const isFollowed: FollowRelationType | any = await checkfollowUser(userInfo.id, user.id)
              setIsFollowedByMe(isFollowed.fromFollowedTo || false) // 我A(from)=>他人B(to)
            }
            // 没登录
            else {
              setIsFollowedByMe(false)
            }
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
  }, [updateTrigger,visitCase, user])

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

  const handleFollow = async (user: UserInfo) => {
    await followUser(user.id, currentUser?.id!)
    message.success(`success following ${currentUser?.address}`)
    setUpdateTrigger(new Date().getTime())
  }

  const handleUnFollow = async (user: UserInfo) => {
    await unfollowUser(user.id, currentUser?.id!)
    message.success(`success unfollow ${currentUser?.address}`)
    setUpdateTrigger(new Date().getTime())
  }

  if (loading) {
    return (
      <div className="h-400px fcc-center">
        <Skeleton active />
      </div>
    )
  }

  return (
    <div className='mt-70px'>
      {/* 处理数据为空的情况 */}
      {currentUser && <div className="mt-70px w-full px-6 pb-6 fcc-center font-ArchivoNarrow">
        <span className="text-center text-xl w-200px overflow-hidden text-ellipsis" title={currentUser?.displayName}>
          {currentUser.displayName === currentUser.address ? getShortAddress(currentUser.address) : currentUser.displayName}
        </span>
      </div>}
      <div className="mx-10 frc-center flex-wrap">
        <a
          className={`${followers?.length > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl mr-4 `}
          onClick={() => {
            handleJumpFollowers(followers?.length)
          }}
        >
          <span className="text-black">{followers?.length || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
        </a>
        <a
          className={`${followings?.length > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            handleJumpFollowing(followings?.length)
          }}
        >
          <span className="text-black">{followings?.length || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
        </a>
      </div>
      <p className="m-10 text-xl line-wrap three-line-wrap">
        {currentUser?.bio || visitCase === 0 ? '' : "The user hasn't given a bio on Lens for self yet :)"}
      </p>
      {routeAddress && routeAddress !== user?.address && (
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
    </div>
  )
}

export default DeschoolCard
