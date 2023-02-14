import { useEffect, useState } from 'react'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import LensAvatar from '../userCard/avatar'
import type { ProfileExtend } from '~/lib/types/app'

type SuggestProp = {
  handle?: string
}

// 根据match config配置的参数推荐用户想找的人
const Suggest = (props: SuggestProp) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { handle } = props
  const [loading, setLoading] = useState(false)
  const [suggestedUsers, setSuggestedUsers] = useState([] as Array<ProfileExtend | undefined | null>)
  console.log('handle', handle)

  const initSuggestedUsers = async () => {
    setLoading(true)
    try {
      // let result
      // const params = { address, limit: 10 }
      // if (cursor) {
      //   Object.assign(params, { cursor })
      // }
      // result = await followingRequest(params)
      // setCursor(result.pageInfo.next)
      // setSuggestedUsers([] as Array<ProfileExtend | undefined | null>)
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initSuggestedUsers()
  }, [])

  const handleJumpMatch = () => {
    navigate('/profile/match')
  }

  return (
    <div className="w-full fcs-center">
      <div className="w-full mb-6 text-right">
        <button type="button" className="purple-border-button p-2" onClick={handleJumpMatch}>
          Re-fill Config Form
        </button>
      </div>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="shadow-module fcc-start max-h-600px p-4 space-y-2 overflow-auto scroll-hidden">
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers?.map(suggestedUser => (
              <div key={suggestedUser?.id} className="relative border rounded-xl p-2 w-full frs-center">
                <div className="relative w-60px h-60px">
                  <LensAvatar avatarUrl={suggestedUser?.avatarUrl} size={60} wrapperClassName="fcc-center w-full" />
                </div>
                <div className="flex-1 fcs-center ml-2">
                  <h1>{suggestedUser?.name}</h1>
                  <p>{suggestedUser?.bio}</p>
                </div>
                <div>
                  <h2>He / She is suggested because</h2>
                  <ul>
                    <li>* You both have interests in finding a hachathon partner</li>
                    <li>* You both are interested in DAO topic.</li>
                    <li>* Your skills exclusively match each other and share the same ideology in terms of industry commitments.</li>
                  </ul>
                </div>
                <div>
                  <button type="button" className="purple-border-button px-2 py-1">
                    {suggestedUser?.isFollowedByMe ? t('UnFollow') : t('Follow')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>
      )}
    </div>
  )
}
export default Suggest
