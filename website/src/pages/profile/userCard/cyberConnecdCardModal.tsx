import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'antd/es/modal/Modal'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import ShowMoreLoading from '~/components/loading/showMore'
import { RoleType } from '~/lib/enum'
import { getUserContext, useAccount } from '~/context/account'
import { Link } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import useFollow from '~/hooks/useCyberConnectFollow'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import { GET_FOLLOWING_LIST_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingListByAddressEVM'
import { GET_FOLLOWER_LIST_BY_HANDLE } from '~/api/cc/graphql/GetFollowersListByHandle'
import LensAvatar from './avatar'
import type { CyberProfile } from '~/lib/types/app'

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
  const { cyberToken, cyberProfile } = useAccount()
  const [follows, setFollows] = useState([] as Array<CyberProfile | null>)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [getFollowingByAddressEVM] = useLazyQuery(GET_FOLLOWING_LIST_BY_ADDRESS_EVM)
  const [getFollowingByHandle] = useLazyQuery(GET_FOLLOWER_LIST_BY_HANDLE)
  const { follow } = useFollow();
  const { unFollow } = useUnFollow();
  const [isFollowLoaindg, setIsFollowLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)

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
    console.log('followers', followers)
    let edges = followers?.edges || []
    edges = edges.map((item: any) => ({
        address: item.node.address.address,
        avatar: item.node.profile.avatar,
        handleStr: item.node.profile.handle,
        handle: item.node.profile.handle.split('.cc')[0],
        id: item.node.profile.id,
        isFollowedByMe: item.node.profile.isFollowedByMe,
        bio: item.node.profile.metadataInfo.bio,
        displayName: item.node.profile.metadataInfo.displayName,
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

  const initFollowRelationship = async () => {
    setLoading(true)
    try {
      if (type === 'followers') {
        initUserFollowersInfo(cyberProfile?.handle, cyberToken?.address!)
      } else {
        initUserFollowingsInfo(routeAddress!)
      }
    } catch(error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible) {
      initFollowRelationship()
    }
  }, [visible])

  const handleAddMore = async () => {
    setLoadingMore(true)
    page += 1
    try {
      await initFollowRelationship()
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
    console.log('result', result)
    // 关注成功后，刷新页面
    // setUpdateTrigger(updateTrigger + 1)
  };

  const handleUnfollow = async (handle: string) => {
    if (isFollowLoaindg) {
      message.warning('Please wait a moment')
      return
    }
    setIsFollowLoading(true)
    const result = await unFollow(handle)
    setIsFollowLoading(false)
    console.log('result', result)
    // 关注成功后，刷新页面
    // setUpdateTrigger(updateTrigger + 1)
  };

  const role = getUserContext().getLoginRoles()

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
                  <div className="flex-1 fcs-center ml-2">
                    <Link to={`/profile/${f?.address}/resume`}>
                      <h1>{f?.name}</h1>
                    </Link>
                    <p>{f?.bio}</p>
                  </div>
                  <div>
                    {/* 这里有多种情况： */}
                    {/* 一、用户在看自己的 Following，此时可以显示 Unfollow 按钮。如果两人互关以文字形式写在名字旁边 */}
                    {/* 二、用户在看自己的Followers，此时有 Follow 按钮用以回关，如果双向关注则显示出来，hover上去变成 Unfollow */}
                    {/* 三、用户在看别人的 Following，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* 四、用户在看别人的 Follower，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* TODO */}
                    {!role.includes(RoleType.UserOfCyber) ? null : (
                      <button
                        type="button"
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
                      </button>
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
                  <button
                    type="button"
                    className={`bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2 ${loadingMore ? 'cursor-not-allowed' : ''}`}
                    onClick={handleAddMore}
                  >
                    {t('SeeMore')}
                  </button>
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
