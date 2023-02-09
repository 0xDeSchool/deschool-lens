import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star1 from '~/assets/images/star1.png'
import { getExploreSeries, getExploreSeriesDetail } from '~/api/explore'
import Skeleton from 'antd/es/skeleton'
import Dropdown from 'antd/es/dropdown'
import Button from 'antd/es/button'
import { DropIcon } from '~/components/icon'
import ClockCircleTwoTone from '@ant-design/icons/lib/icons/ClockCircleTwoTone'
import FireTwoTone from '@ant-design/icons/lib/icons/FireTwoTone'
import type { MenuProps } from 'antd/es/menu'
import layoutWidth from '~/styles/shortcut'
import SeriesCard from './components/SeriesCard'
import Loading from './components/loading'
import type { ExploreStudyInfo, Series, SeriesExtend } from '~/lib/types/app'

type ExploreStudyInfoList = {
  [key: string]: ExploreStudyInfo
}

const HotSeries = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(true)
  const [seriesesDetails, setSeriesesDetails] = useState({} as ExploreStudyInfoList)
  const [serieses, setSerieses] = useState([] as SeriesExtend[])
  const [cacheSerieses, setCacheSerieses] = useState([] as SeriesExtend[])
  const [sortType, setSortType] = useState('1')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 3

  const initSeries = async () => {
    setLoading(true)
    try {
      const sortStr = sortType === '1' ? '-updatedAt' : '-enrolledCount'
      const res: any = await getExploreSeries(page, pageSize, sortStr)
      if (res && res.items) {
        setSerieses(res.items)
        setCacheSerieses(res.items.slice())
        setTotal(res.totalCount)
      }
    } finally {
      setLoading(false)
    }
  }

  const initSeriesDetails = async () => {
    setLoadingDetail(true)
    try {
      const res: any = await getExploreSeriesDetail({ ids: cacheSerieses.map(s => s.id) })
      if (res) {
        setSeriesesDetails(res)
      }
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleAddMore = async () => {
    setLoadingMore(true)
    try {
      const sortStr = sortType === '1' ? '-updatedAt' : '-enrolledCount'
      const res: any = await getExploreSeries(page + 1, pageSize, sortStr)
      if (res && res.items) {
        setSerieses(serieses.concat(res.items))
        setCacheSerieses(cacheSerieses.concat(res.items))
      }
      setPage(page + 1)
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (serieses.length > 0 && cacheSerieses.length > 0) {
      initSeriesDetails()
    }
  }, [serieses])

  useEffect(() => {
    initSeries()
  }, [sortType])

  const handleMenuClick: MenuProps['onClick'] = e => {
    setSortType(e.key)
  }

  const items: MenuProps['items'] = [
    {
      label: 'Recently released',
      key: 1,
      icon: <ClockCircleTwoTone />,
    },
    {
      label: 'Hot',
      key: 2,
      icon: <FireTwoTone twoToneColor="#ff6319" />,
    },
  ]

  const menuProps = {
    items,
    onClick: handleMenuClick,
  }

  const isInLoading = (series: Series) => {
    if (cacheSerieses.find(s => s.id === series.id)) {
      return true && loadingDetail
    }
    return false && loadingDetail
  }

  return (
    <div className="fcc-center">
      <div className="w-auto">
        {/* 标题 */}
        <div className="fcc-center">
          <div className="relative text-left w-3/4">
            <img src={Star1} alt="star1" className="w-80px h-80px" />
          </div>
          <h1 className="text-56px leading-84px text-center font-Anton w-400px md:w-680px">{t('hotSeries.title')}</h1>
          <p className="text-24px leading-32px font-ArchivoNarrow w-400px md:w-max">{t('hotSeries.description')}</p>
        </div>
        <div className="frc-end w-auto mt-32px mb-24px mx-4">
          <Dropdown menu={menuProps} className="rounded">
            <Button className="flex items-center">
              <span>
                {sortType === '1' ? (
                  <div>
                    <ClockCircleTwoTone /> Recently Released
                  </div>
                ) : (
                  <div>
                    <FireTwoTone twoToneColor="#ff6319" />
                    Hot
                  </div>
                )}
              </span>
              <DropIcon style={{ width: '8px', height: '6px' }} />
            </Button>
          </Dropdown>
        </div>
        {/* 热门系列课程 */}
        {loading ? (
          <div className={`frc-center flex-wrap ${layoutWidth} m-auto`}>
            <div className="w-357px shadow-md p-4">
              <Skeleton.Image style={{ width: '320px', height: '195px' }} className="mb-4" />
              <Skeleton />
            </div>
            <div className="w-357px mx-4 shadow-md p-4">
              <Skeleton.Image style={{ width: '320px', height: '195px' }} className="mb-4" />
              <Skeleton />
            </div>
            <div className="w-357px shadow-md p-4">
              <Skeleton.Image style={{ width: '320px', height: '195px' }} className="mb-4" />
              <Skeleton />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-3 m-auto">
            {serieses.map(series => (
              <SeriesCard key={series.id} series={series} loadingDetail={isInLoading(series)} seriesDetail={seriesesDetails[series.id]} />
            ))}
          </div>
        )}
        {/* 加载更多的过渡 */}
        {loadingMore && (
          <div className="mt-10 w-full frc-center">
            <Loading />
          </div>
        )}
        {total > serieses.length && (
          <div className="text-center mt-10">
            <button type="button" className="bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2" onClick={handleAddMore}>
              {t('SeeMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotSeries
