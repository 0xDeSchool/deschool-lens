import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star1 from '~/assets/images/star1.png'
import { getExploreSeries, getExploreSeriesDetail } from '~/api/go/explore'
import Skeleton from 'antd/es/skeleton'
import SeriesCard from './SeriesCard'
import type { ExploreStudyInfo, Series, SeriesExtend } from '~/lib/types/app'

type ExploreStudyInfoList = {
  [key: string]: ExploreStudyInfo
}

const HotSeries = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [seriesesDetails, setSeriesesDetails] = useState({} as ExploreStudyInfoList)
  const [serieses, setSerieses] = useState([] as SeriesExtend[])
  const [cacheSerieses, setCacheSerieses] = useState<string[]>([])
  const [total, setTotal] = useState(0)

  const fetchSeriesDetails = async (ids: string[]) => {
    try {
      setCacheSerieses(ids)
      const res: any = await getExploreSeriesDetail({ ids })
      if (res) {
        setSeriesesDetails({ ...seriesesDetails, ...res })
      }
    } finally {
      setCacheSerieses([])
    }
  }

  const initSeries = async () => {
    setLoading(true)
    try {
      const sortStr = '-updatedAt'
      const res: any = await getExploreSeries(1, 6, sortStr)
      if (res && res.items) {
        setSerieses(res.items)
        fetchSeriesDetails(res.items.slice().map((s: Series) => s.id))
        setTotal(res.totalCount)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleViewAll = async () => {
    window.open('https://deschool.app/explore', '_blank')
  }

  useEffect(() => {
    initSeries()
  }, [])

  return (
    <div className="fcc-center">
      <div className="w-auto">
        {/* 标题 */}
        <div className="fcc-center">
          <div className="relative text-left w-3/4">
            <img src={Star1} alt="star1" className="w-80px h-80px" />
          </div>
          <h1 className="text-56px leading-84px text-center font-Anton w-400px md:w-680px">{t('landing.hotCourses')}</h1>
          <p className="text-24px leading-32px font-ArchivoNarrow w-400px md:w-max">{t('landing.hotCoursesDes')}</p>
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
          <div className="grid gap-4 grid-cols-3 m-auto">
            {serieses.map(series => (
              <SeriesCard
                key={series.id}
                series={series}
                loadingDetail={cacheSerieses.includes(series.id)}
                seriesDetail={seriesesDetails[series.id]}
              />
            ))}
          </div>
        )}
        {total > serieses.length && (
          <div className="text-center mt-10">
            <button type="button" className="bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2 uppercase" onClick={handleViewAll}>
              {t('landing.seeallcourse')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotSeries
