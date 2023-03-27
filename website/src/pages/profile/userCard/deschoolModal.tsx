import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'antd/es/modal/Modal'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import { followUser, getFollowers, getFollowings, unfollowUser } from '~/api/booth/follow'
import Jazzicon from 'react-jazzicon'
import { getShortAddress } from '~/utils/format'
import { Link } from 'react-router-dom'
import { useAccount } from '~/account'
import type { UserFollower, UserFollowing } from '~/api/booth/types'

type FollowType = UserFollower & UserFollowing

const DeschoolFollowersModal = (props: {
  userId: string | undefined
  type: 'followers' | 'following'
  visible: boolean
  closeModal: any
  setUpdateTrigger: Dispatch<SetStateAction<number>>
}) => {
  const { userId, type, visible, closeModal, setUpdateTrigger } = props
  const { t } = useTranslation()
  const [follows, setFollows] = useState<FollowType[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAccount()

  const initList = async () => {
    setLoading(true)
    try {
      if (!userId) {
        return
      }
      if (type === 'following') {
        const resFollowings = await getFollowings(userId)
        if (resFollowings) {
          setFollows(resFollowings)
        }
      } else {
        const resFollowers = await getFollowers(userId)
        if (resFollowers) {
          setFollows(resFollowers)
        }
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

  const handleFollow = async (address: string) => {
    await followUser(address, user?.address!)
    message.success(`success following ${address}`)
    setUpdateTrigger(new Date().getTime())
  }

  const handleUnFollow = async (address: string) => {
    await unfollowUser(address, user?.address!)
    message.success(`success following ${address}`)
    setUpdateTrigger(new Date().getTime())
  }

  return (
    <Modal
      title={t(type)}
      open={visible}
      destroyOnClose
      closable
      onCancel={e => {
        setFollows([] as FollowType[])
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
                <div key={follow.follower?.id || follow.following?.id} className="relative border rounded-xl p-2 w-full frc-center">
                  <div className="relative w-60px h-60px">
                    <Jazzicon diameter={60} seed={Math.floor(Math.random() * 30)} />
                  </div>
                  <div className="flex-1 fcs-center ml-2">
                    <Link to={`/profile/${follow.follower?.address || follow.following?.address}/resume`}>
                      <h1 className="text-xl">{getShortAddress(follow.follower?.displayName || follow.following?.displayName)}</h1>
                    </Link>
                  </div>
                  <div>
                    {/* 这里有多种情况： */}
                    {/* 一、用户在看自己的 Following，此时可以显示 Unfollow 按钮。如果两人互关以文字形式写在名字旁边 */}
                    {/* 二、用户在看自己的Followers，此时有 Follow 按钮用以回关，如果双向关注则显示出来，hover上去变成 Unfollow */}
                    {/* 三、用户在看别人的 Following，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* 四、用户在看别人的 Follower，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* TODO */}
                    {(((follow.follower || follow?.following)!) && user?.address) && (
                      <button
                        type="button"
                        className="purple-border-button px-2 py-1"
                        onClick={() => {
                          if (follow?.vistorFollowedPerson) {
                            handleUnFollow((follow.follower?.address || follow?.following?.address)!)
                          } else if (follow && !follow?.vistorFollowedPerson) {
                            handleFollow((follow.follower?.address || follow?.following?.address)!)
                          }
                        }}
                      >
                        {follow?.vistorFollowedPerson ? t('UnFollow') : t('Follow')}
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
