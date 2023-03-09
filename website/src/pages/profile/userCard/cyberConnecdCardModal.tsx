import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'antd/es/modal/Modal'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import ShowMoreLoading from '~/components/loading/showMore'
import { RoleType } from '~/lib/enum'
import { getUserContext } from '~/context/account'
import { Link } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import useFollow from '~/hooks/useCyberConnectFollow'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import { GET_FOLLOWING_LIST_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingListByAddressEVM'
import { GET_FOLLOWER_LIST_BY_HANDLE } from '~/api/cc/graphql/GetFollowersListByHandle'
import LensAvatar from './avatar'
import { useAccount } from '~/account'
import { PRIMARY_PROFILE } from '~/api/cc/graphql'
import { UserPlatform } from '~/api/booth/types'
import { CyberProfile } from '~/lib/types/app'
import Button from 'antd/es/button'

const PADE_SIZE = 10
let page = 1
const FollowersModal = (props: {
  routeAddress: string | undefined
  type: 'followers' | 'following'
  visible: boolean
  closeModal: any
}) => {
  const { routeAddress, type, visible, closeModal } = props
  const { t } = useTranslation()
  const [follows, setFollows] = useState([] as Array<CyberProfile | null>)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [getFollowingByAddressEVM] = useLazyQuery(GET_FOLLOWING_LIST_BY_ADDRESS_EVM)
  const [getFollowingByHandle] = useLazyQuery(GET_FOLLOWER_LIST_BY_HANDLE)
  const [getPrimaryProfile] = useLazyQuery(PRIMARY_PROFILE);
  const [currentUser, setCurrentUser] = useState<UserPlatform>()
  const { follow } = useFollow();
  const { unFollow } = useUnFollow();
  const [isFollowLoaindg, setIsFollowLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const user = useAccount()
  const cyberProfile = user?.ccProfile()

  // 获取用户的关注者
  const initUserFollowersInfo = async (handle: string, address: string) => {
    const resp = await getFollowingByHandle({
      variables: {
        handle,
        me: address,
        first: page * PADE_SIZE,
      },
    })
    const followers = resp?.data?.profileByHandle?.followers
    const hasNext = followers?.pageInfo?.hasNextPage
    setHasNextPage(hasNext)
    let edges = followers?.edges || []
    edges = edges.map((item: any) => ({
        address: item.node.address.address,
        avatar: item.node.profile.avatar,
        handle: item.node?.address?.wallet?.primaryProfile?.handle,
        displayName: item.node?.address?.wallet?.primaryProfile?.metadataInfo?.displayName,
        isFollowedByMe: item.node.profile.isFollowedByMe,
      }))
    setFollows(edges)
  }

  // 获取用户的关注的人
  const initUserFollowingsInfo = async (address: string) => {
    const resp = await getFollowingByAddressEVM({
      variables: {
        address,
      },
    })
    const followings = resp?.data?.address?.followings
    const hasNextPage = followings?.pageInfo?.hasNextPage
    setHasNextPage(hasNextPage)
    let edges = followings?.edges || []
    edges = edges.map((item: any) => ({
        address: item.node.address.address,
        ...item.node.profile,
      }))
    setFollows(edges)
  }

  const initFollowRelationship = async (handle: string, address: string) => {
    setLoading(true)
    try {
      if (type === 'followers') {
        initUserFollowersInfo(handle, user?.address!)
      } else {
        initUserFollowingsInfo(routeAddress!)
      }
    } catch(error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 根据不同情况初始化用户信息
  const initUserInfo = async (address: string) => {
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
       // 此人没有handle，cyber没数据
       if (!userInfo) {
        setCurrentUser({} as UserPlatform)
        return
      }
      // 此人有数据
      setCurrentUser(userInfo)
      initFollowRelationship(userInfo?.handle, address)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible) {
      initUserInfo(routeAddress!)
    }
  }, [visible])

  const handleAddMore = async () => {
    setLoadingMore(true)
    page += 1
    try {
      await initFollowRelationship(currentUser?.handle!, routeAddress!)
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleFollow = async (handle: string) => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    const result = await follow(handle)
    setIsFollowLoading(false)
    // 关注成功后，刷新页面
    initUserInfo(routeAddress!)
  };

  const handleUnfollow = async (handle: string) => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    const result = await unFollow(handle)
    setIsFollowLoading(false)
    // 关注成功后，刷新页面
    initUserInfo(routeAddress!)
  };

  return (
    <Modal
      title={t(type)}
      open={visible}
      destroyOnClose
      closable
      onCancel={e => {
        setFollows([] as Array<CyberProfile | null>)
        closeModal(e)
      }}
      footer={null}
    >
      {loading ? (
        <Skeleton />
      ) : (
        <div className="fcc-start max-h-600px space-y-2 overflow-auto scroll-hidden">
          {follows && follows.length > 0 ? (
            <div className="w-full">
              {follows?.map(f => (
                <div key={`${f?.id}-${f?.address}`} className="relative border rounded-xl p-2 w-full frs-center">
                  <div className="relative w-60px h-60px">
                    <LensAvatar avatarUrl={f?.avatar} size={60} wrapperClassName="fcc-center w-full" />
                  </div>
                  <div className="flex-1 fcs-center ml-2 h-60px">
                    <Link to={`/profile/${f?.address}/resume`}>
                      <h1>{f?.displayName || f?.handle}</h1>
                    </Link>
                  </div>
                  <div className='h-60px frc-center'>
                    {/* 这里有多种情况： */}
                    {/* 一、用户在看自己的 Following，此时可以显示 Unfollow 按钮。如果两人互关以文字形式写在名字旁边 */}
                    {/* 二、用户在看自己的Followers，此时有 Follow 按钮用以回关，如果双向关注则显示出来，hover上去变成 Unfollow */}
                    {/* 三、用户在看别人的 Following，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* 四、用户在看别人的 Follower，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* TODO */}
                    {user?.address && cyberProfile?.handle && (
                      <Button
                        disabled={isFollowLoaindg}
                        className="purple-border-button px-2 py-1"
                        onClick={() => {
                          if (f?.isFollowedByMe) {
                            handleUnfollow(f?.handle)
                          } else {
                            handleFollow(f?.handle)
                          }
                        }}
                      >
                        {f?.isFollowedByMe ? t('UnFollow') : t('Follow')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {loadingMore && (
                <div className="mt-10 w-full frc-center">
                  <ShowMoreLoading />
                </div>
              )}
              {hasNextPage && (
                <div className="text-center mt-10">
                  <Button
                    disabled={loadingMore}
                    className={`bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2 ${loadingMore ? 'cursor-not-allowed' : ''}`}
                    onClick={handleAddMore}
                  >
                    {t('SeeMore')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </Modal>
  )
}
export default FollowersModal
