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
import type { ProfileExtend } from '~/lib/types/app'
import LensAvatar from './avatar'
import { useLazyQuery } from '@apollo/client'
import { GET_FOLLOWING_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingsByAddressEVM'
import { GET_FOLLOWING_BY_HANDLE } from '~/api/cc/graphql/GetFollowingsByHandle'

import useFollow from '~/hooks/useCyberConnectFollow'
import useUnFollow from '~/hooks/useCyberConnectUnfollow'
import { PRIMARY_PROFILE_ESSENCES } from '~/api/cc/graphql'

const FollowersModal = (props: {
  routeAddress: string | undefined
  profileId: string | undefined
  type: 'followers' | 'following'
  visible: boolean
  closeModal: any
}) => {
  const { routeAddress, profileId, type, visible, closeModal } = props
  const { t } = useTranslation()
  const { cyberToken, cyberProfile } = useAccount()
  const [follows, setFollows] = useState([] as Array<ProfileExtend | undefined | null>)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [getFollowingByAddressEVM] = useLazyQuery(GET_FOLLOWING_BY_ADDRESS_EVM)
  const [getFollowingByHandle] = useLazyQuery(GET_FOLLOWING_BY_HANDLE)
  const { follow } = useFollow();
  const { unFollow } = useUnFollow();

  const initList = async () => {
    setLoading(true)
    try {
      const getFollowings = async () => {
        const resp1 = await getFollowingByHandle({
          variables: {
            handle: 'shiyu',
            me: "0xD790D1711A9dCb3970F47fd775f2f9A2f0bCc348"
          }
        })
      }
      await getFollowings()
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible) {
      initList()
    }
  }, [visible])

  const handleAddMore = async () => {
    setLoadingMore(true)
    try {
      await getFollowingByAddressEVM()
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleFollow = async () => {
    const result = follow(cyberToken?.address!, 'shiyu')
    console.log('result', result)
  };

  const handleUnfollow = async () => {
    const result = unFollow(cyberToken?.address!, 'shiyu')
    console.log('result', result)
  };

  const role = getUserContext().getLoginRoles()

  return (
    <Modal
      title={t(type)}
      open={visible}
      destroyOnClose
      closable
      onCancel={e => {
        setFollows([] as Array<ProfileExtend | undefined | null>)
        setTotal(0)
        closeModal(e)
      }}
      footer={null}
    >
      {loading ? (
        <Skeleton />
      ) : (
        <div className="fcc-start max-h-600px space-y-2 overflow-auto scroll-hidden">
          <button onClick={() => handleFollow()}>follow</button>
          {follows && follows.length > 0 ? (
            <div className="w-full">
              {follows?.map(follow => (
                <div key={follow?.id} className="relative border rounded-xl p-2 w-full frs-center">
                  <div className="relative w-60px h-60px">
                    <LensAvatar avatarUrl={follow?.avatarUrl} size={60} wrapperClassName="fcc-center w-full" />
                  </div>
                  <div className="flex-1 fcs-center ml-2">
                    <Link to={`/profile/${follow?.ownedBy}/resume`}>
                      <h1>{follow?.name}</h1>
                    </Link>
                    <p>{follow?.bio}</p>
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
                          if (follow?.isFollowedByMe) {
                            handleUnfollow()
                          } else {
                            handleFollow()
                          }
                        }}
                      >
                        {follow?.isFollowedByMe ? t('UnFollow') : t('Follow')}
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
              {follows && follows.length > 0 && total > follows.length && (
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
