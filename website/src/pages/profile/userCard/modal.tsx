import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'antd/es/modal/Modal'
import { followersRequest } from '~/api/lens/follow/followers'
import { followingRequest } from '~/api/lens/follow/following'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import { getExtendProfile } from '~/hooks/profile'
import type { ProfileExtend } from '~/lib/types/app'
import LensAvatar from './avatar'

const FollowersModal = (props: {
  address: string | undefined
  profileId: string | undefined
  type: 'followers' | 'following'
  visible: boolean
  closeModal: any
}) => {
  const { address, profileId, type, visible, closeModal } = props
  const { t } = useTranslation()
  const [cursor, setCursor] = useState<string>('')
  const [follows, setFollows] = useState([] as Array<ProfileExtend | undefined | null>)
  const [loading, setLoading] = useState(false)

  const initFollowers = async () => {
    setLoading(true)
    try {
      let result
      if (type === 'followers') {
        const params = {
          profileId,
          limit: 10,
        }

        if (cursor) {
          Object.assign(params, { cursor })
        }
        result = await followersRequest(params)
        setCursor(result.pageInfo.next)
        setFollows(result.items?.map(item => getExtendProfile(item?.wallet?.defaultProfile)) as Array<ProfileExtend | undefined | null>)
      } else {
        const params = { address, limit: 10 }
        if (cursor) {
          Object.assign(params, { cursor })
        }
        result = await followingRequest(params)
        setCursor(result.pageInfo.next)
        setFollows(result.items.map(item => getExtendProfile(item?.profile)) as Array<ProfileExtend | undefined | null>)
      }
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initFollowers()
  }, [visible])

  return (
    <Modal
      title={t(type)}
      open={visible}
      destroyOnClose
      closable
      onCancel={e => {
        closeModal(e)
      }}
      footer={null}
    >
      {loading ? (
        <Skeleton />
      ) : (
        <div className="fcc-start max-h-600px space-y-2 overflow-auto scroll-hidden">
          {follows && follows.length > 0 ? (
            follows?.map(follow => (
              <div key={follow?.id} className="relative border rounded-xl p-2 w-full frs-center">
                <div className="relative w-60px h-60px">
                  <LensAvatar avatarUrl={follow?.avatarUrl} size={60} wrapperClassName="fcc-center w-full" />
                </div>
                <div className="flex-1 fcs-center ml-2">
                  <h1>{follow?.name}</h1>
                  <p>{follow?.bio}</p>
                </div>
                <div>
                  <button type="button" className="purple-border-button px-2 py-1">
                    {follow?.isFollowedByMe ? t('UnFollow') : t('Follow')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>
      )}
    </Modal>
  )
}
export default FollowersModal
