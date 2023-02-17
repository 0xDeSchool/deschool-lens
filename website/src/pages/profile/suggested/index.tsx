import { useEffect, useState } from 'react'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
// import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import Jazzicon from 'react-jazzicon'
import { getRecommendation } from '~/api/booth/booth'
import { getAddress } from '~/auth'
import Button from 'antd/es/button'
import type { RecommendAddr } from '~/lib/types/app'

// 根据match config配置的参数推荐用户想找的人
const Suggest = () => {
  // const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [suggestedUser, setSuggestedUser] = useState({} as RecommendAddr)

  const initSuggestedUsers = async () => {
    setLoading(true)
    try {
      const address = getAddress()
      if (!address) {
        return
      }
      const result = await getRecommendation(address)
      if (!result) {
        return
      }
      setSuggestedUser(result)
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
          Edit preferences
        </button>
      </div>
      {loading && <Skeleton />}
      {!loading && suggestedUser ? (
        <div className="border rounded-xl w-full  p-4 min-h-240px">
          <div className="frs-start">
            <div className="px-4 mr-2">
              {/* <LensAvatar avatarUrl={suggestedUser?.avatarUrl} size={60} wrapperClassName="fcc-center w-full" /> */}
              <Jazzicon diameter={70} seed={Number(suggestedUser?.ToAddr)} />
            </div>
            <div className="flex-1 fcs-center ml-">
              <h1 className="mb-2 font-bold text-lg">{suggestedUser?.ToAddr}</h1>
              <h2 className="mb-1">He/She is recommended because</h2>
              <ul>
                {suggestedUser.Reasons &&
                  suggestedUser.Reasons.map(item => (
                    <li key={item} className="ml-2 my-1">
                      * {item}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between items-center h-full">
              <div className="flex flex-col items-center">
                <div>RECOMMENDED SCORE</div>
                <div className="text-4xl my-2">{suggestedUser.Score}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <Button type="primary">Visit Space</Button>
            <Button className="ml-2">Follow</Button>
            <Button disabled className="ml-2">
              Chat
            </Button>
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  )
}
export default Suggest
