import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star4 from '~/assets/images/Star4.png'
import { getExploreCourses, getExploreCoursesDetail } from '~/api/explore'
import Skeleton from 'antd/es/skeleton'
import Dropdown from 'antd/es/dropdown'
import type { MenuProps } from 'antd/es/menu'
import Button from 'antd/es/button'
import ClockCircleTwoTone from '@ant-design/icons/lib/icons/ClockCircleTwoTone'
import FireTwoTone from '@ant-design/icons/lib/icons/FireTwoTone'
import { DropIcon } from '~/components/icon'
import layoutWidth from '~/styles/shortcut'
import Loading from './components/loading'
import CourseCard from './components/CourseCard'
import type { ExploreCourse, ExploreStudyInfo } from '~/lib/types/app'

type ExploreStudyInfoList = {
  [key: string]: ExploreStudyInfo
}

const HotCourses = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(true)
  const [coursesDetails, setCoursesDetails] = useState({} as ExploreStudyInfoList)
  const [courses, setCourses] = useState([] as ExploreCourse[])
  const [cacheCourses, setCacheCourses] = useState([] as ExploreCourse[])
  const [sortType, setSortType] = useState('1')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 3

  const initCourses = async () => {
    setLoading(true)
    try {
      const sortStr = sortType === '1' ? '-updatedAt' : '-enrolledCount'
      const res: any = await getExploreCourses(page, pageSize, sortStr)
      if (res && res.items) {
        setCourses(res.items)
        setCacheCourses(res.items.slice())
        setTotal(res.totalCount)
      }
    } finally {
      setLoading(false)
    }
  }

  const initCoursesDetails = async () => {
    setLoadingDetail(true)
    try {
      const res: any = await getExploreCoursesDetail({ ids: cacheCourses.map(c => c.id) })
      if (res) {
        setCoursesDetails(res)
      }
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleAddMore = async () => {
    setLoadingMore(true)
    try {
      const sortStr = sortType === '1' ? '-updatedAt' : '-enrolledCount'
      const res: any = await getExploreCourses(page + 1, pageSize, sortStr)
      if (res && res.items) {
        setCourses(courses.concat(res.items))
        setCacheCourses(cacheCourses.concat(res.items))
      }
      setPage(page + 1)
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (courses.length > 0 && cacheCourses.length > 0) {
      initCoursesDetails()
    }
  }, [courses])

  useEffect(() => {
    initCourses()
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

  const isInLoading = (course: ExploreCourse) => {
    if (cacheCourses.find(c => c.id === course.id)) {
      return true && loadingDetail
    }
    return false && loadingDetail
  }

  return (
    <div className="fcc-center mt-32">
      <div className="w-auto">
        {/* 标题 */}
        <div className="fcc-start mx-4">
          <div className="relative flex justify-end w-420px md:w-640px xl:w-800px">
            <img src={Star4} alt="star4" className="w-36px h-36px absolute top--6" />
          </div>
          <h1 className="text-48px leading-72px text-left font-Anton w-400px md:w-640px xl:w-800px">{t('hotCourses.title')}</h1>
        </div>
        {/* 总数和筛选 */}
        <div className="frc-between w-auto mt-32px mb-24px mx-4">
          <span className="font-ArchivoNarrow text-24px leading-32px">
            {t('hotCourses.courses')}({total})
          </span>
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
        {/* 热门课程 */}
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
            {courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                loadingDetail={isInLoading(course)}
                courseDetail={coursesDetails[course.id]}
              />
            ))}
          </div>
        )}
        {/* 加载更多的过渡 */}
        {loadingMore && (
          <div className="mt-10 w-full frc-center">
            <Loading />
          </div>
        )}
        {total > courses.length && (
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

export default HotCourses
