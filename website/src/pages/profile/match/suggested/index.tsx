import { useEffect, useState } from 'react'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
// import { useTranslation } from 'react-i18next'
import Jazzicon from 'react-jazzicon'
import Button from 'antd/es/button'
import { getRecommendation } from '~/api/booth/booth'
import { getShortAddress } from '~/utils/format'
import type { RecommendResult } from '~/lib/types/app'
import { useAccount } from '~/account'
import { NavLink } from 'react-router-dom'

const BOOTH_PATH = import.meta.env.VITE_APP_BOOTH_PATH
// 根据match config配置的参数推荐用户想找的人
const Suggest = (props: { open: boolean }) => {
  // const { t } = useTranslation()
  const { open } = props
  const [loading, setLoading] = useState(false)
  const [suggestedUser, setSuggestedUser] = useState<RecommendResult | null>(null)

  const user = useAccount()
  // 初始化推荐用户
  const initSuggestedUsers = async () => {
    setLoading(true)
    try {
      if (!user) {
        return
      }
      // 获得推荐人
      const result = await getRecommendation(user.id)
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
  }, [open])

  return (
    <div className="w-full fcs-center border shadow-md rounded-xl mt-4">
      {loading && (
        <div className="w-full h-200px fcc-center p-4">
          <Skeleton />
        </div>
      )}
      {!loading && suggestedUser ? (
        <div className="border rounded-xl w-full  p-4">
          {/* 头像 + 推荐分数 */}
          <div className="flex flex-row justify-between">
            <div className="px-4 mr-2">
              {/* <LensAvatar avatarUrl={suggestedUser?.avatarUrl} size={60} wrapperClassName="fcc-center w-full" /> */}
              <Jazzicon diameter={70} seed={Number(suggestedUser?.target?.id)} />
            </div>

            <div className="flex flex-col justify-between items-center h-full">
              <div className="flex flex-col items-center">
                <div>RECOMMENDED SCORE</div>
                <div className="text-4xl my-2">{suggestedUser?.score}</div>
              </div>
            </div>
          </div>
          {/* 推荐原因 */}
          <div className="flex fcs-center ml-">
            <h1 className="mb-2 font-bold text-lg">{getShortAddress(suggestedUser?.target?.displayName)}</h1>
            <h2 className="mb-1">He/She is recommended because</h2>
            <ul>
              {suggestedUser?.reasons &&
                suggestedUser?.reasons.map(item => (
                  <li key={item} className="ml-2 my-1">
                    * {item}
                  </li>
                ))}
            </ul>
          </div>
          {/* 最下面的操作按钮 */}
          {suggestedUser?.target?.address && <div className="flex flex-row justify-between">
            <NavLink to={`/profile/${suggestedUser?.target?.address}/resume`}>
              <Button type="primary">
                Visit Booth
              </Button>
            </NavLink>
            <div>
              <Button disabled className="">
                Chat
              </Button>
            </div>
          </div>}
        </div>
      ) : (
        !loading && (
          <div className="w-full h-200px fcc-center">
            <div className="text-xl font-bold">Recommendation Requires a Form Filled by You</div>
            <div className="mt-4">You haven't fill the preference form in the right of this page yet. </div>
          </div>
        )
      )}
    </div>
  )
}
export default Suggest
