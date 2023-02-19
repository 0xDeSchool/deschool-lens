import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'antd/es/modal/Modal'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import { RoleType } from '~/lib/enum'
import { getUserContext, useAccount } from '~/context/account'
import { followUser, unfollowUser } from '~/api/booth/follow'
import type { DeschoolProfile, OtherDeschoolProfile } from '~/lib/types/app'
import LensAvatar from './avatar'

const DeschoolFollowersModal = (props: {
  followers: any
  followings: any
  type: 'followers' | 'following'
  visible: boolean
  closeModal: any
}) => {
  const { type, visible, closeModal, followers, followings } = props
  const { t } = useTranslation()
  const [follows, setFollows] = useState([] as Array<OtherDeschoolProfile | null>)
  const [loading, setLoading] = useState(true)
  const { deschoolProfile } = useAccount()

  const initList = async () => {
    setLoading(true)
    try {
      if (type === 'followers') {
        setFollows(followers)
      } else {
        setFollows(followings)
      }
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

  const handleFollow = async (user: DeschoolProfile | OtherDeschoolProfile) => {
    await followUser(user.address, deschoolProfile?.address!)
    message.success(`success following ${user.address}`)
  }

  const handleUnFollow = async (user: DeschoolProfile | OtherDeschoolProfile) => {
    await unfollowUser(user.address, deschoolProfile?.address!)
    message.success(`success following ${user?.address}`)
  }

  const role = getUserContext().getLoginRoles()

  return (
    <Modal
      title={t(type)}
      open={visible}
      destroyOnClose
      closable
      onCancel={e => {
        setFollows([] as Array<DeschoolProfile>)
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
              {follows?.map(follow => (
                <div key={follow?.address} className="relative border rounded-xl p-2 w-full frs-center">
                  <div className="relative w-60px h-60px">
                    <LensAvatar avatarUrl={follow?.avatar} size={60} wrapperClassName="fcc-center w-full" />
                  </div>
                  <div className="flex-1 fcs-center ml-2">
                    <h1>{follow?.username}</h1>
                    <p>{follow?.bio}</p>
                  </div>
                  <div>
                    {/* 这里有多种情况： */}
                    {/* 一、用户在看自己的 Following，此时可以显示 Unfollow 按钮。如果两人互关以文字形式写在名字旁边 */}
                    {/* 二、用户在看自己的Followers，此时有 Follow 按钮用以回关，如果双向关注则显示出来，hover上去变成 Unfollow */}
                    {/* 三、用户在看别人的 Following，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* 四、用户在看别人的 Follower，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* TODO */}
                    {!role.includes(RoleType.UserOfLens) ? null : (
                      <button
                        type="button"
                        className="purple-border-button px-2 py-1"
                        onClick={() => {
                          if (follow?.isFollowedByMe) {
                            handleUnFollow(follow!)
                          } else {
                            handleFollow(follow!)
                          }
                        }}
                      >
                        {follow?.isFollowedByMe ? t('UnFollow') : t('Follow')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </Modal>
  )
}
export default DeschoolFollowersModal
