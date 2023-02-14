import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'antd/es/modal/Modal'
import { followersRequest } from '~/api/lens/follow/followers'
import { followingRequest } from '~/api/lens/follow/following'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import { getExtendProfile } from '~/hooks/profile'
import ShowMoreLoading from '~/components/loading/showMore'
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
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)

  const requestUserInfo = async () => {
    let result
    let tempFollows
    if (type === 'followers') {
      const params = {
        profileId,
        limit: 10,
      }

      if (cursor) {
        Object.assign(params, { cursor })
      }
      result = await followersRequest(params)
      tempFollows = result.items?.map(item => getExtendProfile(item?.wallet?.defaultProfile)) as Array<ProfileExtend | undefined | null>
    } else {
      const params = { address, limit: 10 }
      if (cursor) {
        Object.assign(params, { cursor })
      }
      console.log('params', params)

      result = await followingRequest(params)
      tempFollows = result.items.map(item => getExtendProfile(item?.profile)) as Array<ProfileExtend | undefined | null>
    }
    setCursor(result.pageInfo.next)
    setFollows(follows.concat(tempFollows))
    setTotal(result.pageInfo.totalCount || 0)
  }

  const initList = async () => {
    setLoading(true)
    try {
      await requestUserInfo()
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
      await requestUserInfo()
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <Modal
      title={t(type)}
      open={visible}
      destroyOnClose
      closable
      onCancel={e => {
        setFollows([] as Array<ProfileExtend | undefined | null>)
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
                <div key={follow?.handle} className="relative border rounded-xl p-2 w-full frs-center">
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
