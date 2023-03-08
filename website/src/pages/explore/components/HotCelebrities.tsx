import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star1 from '~/assets/images/star1.png'
import Skeleton from 'antd/es/skeleton'
import Empty from 'antd/es/empty'
import { getLatestUsers } from '~/api/booth'
import type { NewUserInfo } from '~/api/booth/types'
import CelebrityCardNew from './CelebrityCardNew'
import { useAccount } from '~/account'
import ShowMoreLoading from '~/components/loading/showMore'

const PAGE_SIZE = 9
const HotCelebrities = (props: { searchWord: string }) => {
  const { searchWord } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [celebrities, setCelebrities] = useState<NewUserInfo[]>([])
  const [cacheCelebrities, setCacheCelebrities] = useState<NewUserInfo[]>([])
  const [page, setPage] = useState(1)

  const user = useAccount()

  const initSeries = async () => {
    setLoading(true)
    try {
      const response = await getLatestUsers({ page, pageSize: PAGE_SIZE })
      setCelebrities(response.items)
      setCacheCelebrities(response.items)
      setHasNextPage(response.hasNext)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (moreLoading) return
    setMoreLoading(true)
    try {
      const response = await getLatestUsers({ page: page + 1, pageSize: PAGE_SIZE })
      setCelebrities([...celebrities, ...response.items])
      setCacheCelebrities([...cacheCelebrities, ...response.items])
      setHasNextPage(response.hasNext)
      setPage(page + 1)
    } finally {
      setMoreLoading(false)
    }
  }

  useEffect(() => {
    initSeries()
  }, [])

  useEffect(() => {
    setCelebrities(
      cacheCelebrities.filter(
        c =>
          c.address.toLowerCase().includes(searchWord.toLowerCase()) ||
          c.displayName?.toLowerCase().includes(searchWord.toLowerCase()),
      ),
    )
  }, [searchWord])


  // TODO: 跳转到粉丝详情页
  const handleFollowerDetail = (celebrity: NewUserInfo) => {
    console.log('follower detail')
  }

  // TODO: 跳转到关注详情页
  const hanldeFollowingDetail = (celebrity: NewUserInfo) => {
    console.log('following detail')
  }

  return (
    <div className="fcc-center mb-20">
      <div className="w-auto">
        {/* 标题 */}
        <div className="frc-center my-20">
          <img src={Star1} alt="star1" className="w-80px h-80px" />
          <h1 className="text-4xl text-left ml-4 font-Anton flex-1">{t('explore.title2')}</h1>
        </div>

        {/* 热门系列课程 */}
        {loading ? (
          <div className="grid gap-4 grid-cols-3 m-auto">
            <div className="w-357px shadow-md">
              <Skeleton.Image active style={{ width: '357px', height: '195px' }} className="mb-4 mx-auto" />
              <Skeleton active />
            </div>
            <div className="w-357px shadow-md">
              <Skeleton.Image active style={{ width: '357px', height: '195px' }} className="mb-4 mx-auto" />
              <Skeleton />
            </div>
            <div className="w-357px shadow-md">
              <Skeleton.Image active style={{ width: '357px', height: '195px' }} className="mb-4 mx-auto" />
              <Skeleton active />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-auto">
            {celebrities && celebrities.length > 0 ? (
              celebrities.map(celebrity => (
                <CelebrityCardNew
                  key={celebrity.id}
                  userInfo={celebrity}
                  followerDetail={() => handleFollowerDetail(celebrity)}
                  followingDetail={() => hanldeFollowingDetail(celebrity)}
                  refresh={() => initSeries()}
                />
              ))
            ) : <Empty />}
          </div>
        )}
        {(!loading && !moreLoading && hasNextPage) && (
          <div className="text-center mt-10">
            <button type="button" className="bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2" onClick={() => handleLoadMore()}>
              {t('SeeMore')}
            </button>
          </div>
        )}
        {/* 加载更多的过渡 */}
        {(moreLoading) && (
          <div className="mt-10 w-full frc-center">
            <ShowMoreLoading />
          </div>
        )}
      </div>
    </div>
  )
}

export default HotCelebrities
