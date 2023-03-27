import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useFollow from '~/hooks/useCyberConnectFollow'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import message from 'antd/es/message'
import { useAccount } from '~/account'
import Skeleton from 'antd/es/skeleton'
import Button from 'antd/es/button'
import useCyberConnectProfile from '~/hooks/useCyberConnectProfile'
import CreateCyberConnectProfile from './createCCProfile'
import FollowersModal from './cyberConnecdCardModal'
import LensAvatar from './avatar'

type CyberCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

// 0-自己访问自己 1-自己访问别人
const CyberCard = (props: CyberCardProps) => {
  const { visitCase, routeAddress } = props
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const user = useAccount()
  const [updateTrigger] = useState(0) // 此页面局部刷新
  const { t } = useTranslation()
  const { follow } = useFollow();
  const { unFollow } = useUnFollow();
  const [isFollowLoaindg, setIsFollowLoading] = useState(false)
  const { userProfile, followerCount, followingCount, isFollowedByMe, userLoading, fetchUserInfo, refreshFollowInfo } = useCyberConnectProfile()

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    switch (visitCase) {
      // 访问自己的空间
      case 0:
        fetchUserInfo(user?.address!, user?.address!)
        break
      // 访问他人的空间
      case 1: {
        fetchUserInfo(routeAddress!, user?.address!)
        break
      }
      default:
        break
    }
  }

  useEffect(() => {
    setModal({ type: 'followers', visible: false })
    initUserInfo()
  }, [routeAddress, user])

  useEffect(() => {
    if (updateTrigger > 0) {
      setModal({
        type: 'followers',
        visible: false,
      })
    }
  }, [visitCase, updateTrigger, user?.address!])

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
    await follow(userProfile?.handle!)
    setIsFollowLoading(false)
    // 关注成功后，刷新页面
    refreshFollowInfo(userProfile.handle!)
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
    refreshFollowInfo(userProfile.handle!)
  };

  return (
    <div className='pb-1'>
      <div className='relative w-full frc-center'>
        <LensAvatar avatarUrl={userProfile?.avatar} />
      </div>
      {userLoading ?
        (<div className="h-400px fcc-center">
          <Skeleton active />
        </div>)
        : <>
          {/* 处理数据为空的情况 */}
          <div className="mt-70px w-full px-6 pb-6 fcc-center font-ArchivoNarrow">
            <span className="text-xl">
              {userProfile?.displayName || userProfile?.handle}
            </span>
            <span className="text-xl text-gray-5">
              {userProfile?.handle ? `${userProfile.handle.startsWith('@') ? '' : '@'}${userProfile?.handle}` : 'CyberConnect Handle Not Found'}</span>
          </div>
          <div className="mx-10 frc-center flex-wrap">
            <a
              className={`${followerCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
                } text-xl mr-4 `}
              onClick={() => {
                handleJumpFollowers(followerCount)
              }}
            >
              <span className="text-black">{followerCount || '-'} </span>
              <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
            </a>
            <a
              className={`${followingCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
                } text-xl`}
              onClick={() => {
                handleJumpFollowing(followingCount)
              }}
            >
              <span className="text-black">{followingCount || '-'} </span>
              <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
            </a>
          </div>
          {userProfile?.handle ? (
            <p className="m-10 text-xl line-wrap three-line-wrap break-words"  style={{wordBreak: 'break-word'}}>
              {user?.bio || visitCase === 0 ? '' : "The user hasn't given a bio on CyberConnect for self yet :)"}
            </p>
          ) : (
            <div className='pb-16 pt-4'>
              {!userProfile?.handle && <CreateCyberConnectProfile />}
            </div>
          )}
          {visitCase === 1 && (
            <div className="m-10 text-right">
              <Button
                className={`${userProfile?.handle
                  ? 'purple-border-button'
                  : 'inline-flex items-center border border-gray rounded-xl bg-gray-3 text-gray-6 hover:cursor-not-allowed'
                  } px-2 py-1`}
                style={{ color: !isFollowedByMe ? 'white' : '' }}
                type={!isFollowedByMe ? 'primary' : 'default'}
                loading={isFollowLoaindg}
                disabled={!userProfile?.handle || !user?.address}
                onClick={() => {
                  if (isFollowedByMe) {
                    handleUnfollow()
                  } else {
                    handleFollow()
                  }
                }}
              >
                {isFollowedByMe ? t('UnFollow') : t('Follow')}
              </Button>
            </div>
          )}
        </>}
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
