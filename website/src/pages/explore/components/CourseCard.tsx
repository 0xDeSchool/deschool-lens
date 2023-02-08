import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined'
import Skeleton from 'antd/es/skeleton'
import Image from 'antd/es/image'
import Progress from 'antd/es/progress'
import { useTranslation } from 'react-i18next'
import fallbackImage from '~/assets/images/fallbackImage'
import { UnionIcon } from '~/components/icon'
import CrownIcon from '~/assets/icons/crown.png'
// import RoleTag from './RoleTag'
import { useNavigate } from 'react-router'
import Students from './Students'
import type { ExploreStudyInfo, ExploreCourse } from '~/lib/types/app'

const CourseCardDetail = (props: { courseDetail: ExploreStudyInfo }) => {
  const { courseDetail } = props
  const { t } = useTranslation()

  const getCustomTime = (seconds: number) => {
    const day = parseInt((seconds / 60 / 60 / 24).toString(), 10) // 计算天数
    const hour = parseInt(((seconds / 60 / 60) % 24).toString(), 10) // 计算小时
    const minute = parseInt(((seconds / 60) % 60).toString(), 10) // 计算分钟
    let str = ''
    if (day && day > 0) {
      str = `${day}${t('explore.time.day')}`
    }
    if (hour && hour > 0) {
      str = `${str}${hour}${t('explore.time.hour')}`
    }
    if (minute && minute > 0) {
      str = `${str}${minute}${t('explore.time.minute')}`
    }
    return str
  }

  return (
    <>
      <div className="frc-start">
        <ClockCircleOutlined color="#000000d8" size={12} />
        <span className="text-#000000d8 font-ArchivoNarrow text-12px leading-20px ml-2">
          {courseDetail.length ? getCustomTime(courseDetail.length) : '-'}
        </span>
        {courseDetail.courseCount && courseDetail.courseCount > 0 && (
          <>
            <UnionIcon style={{ color: '#000000d8', width: '12x', height: '12px' }} />
            <span className="text-#000000d8 font-ArchivoNarrow text-12px leading-20px ml-2">{courseDetail.courseCount}</span>
          </>
        )}
      </div>
      <Students users={courseDetail.startedUsers} count={courseDetail.startedCount} textColor="text-#000000d8" />
      <Progress percent={courseDetail.studyProgress} />
    </>
  )
}

const CourseCard = (props: { course: ExploreCourse; index: number; loadingDetail: boolean; courseDetail: ExploreStudyInfo }) => {
  const { course, loadingDetail, courseDetail } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleJumpOrgIntro = (channelDomain: string) => {
    if (channelDomain) navigate(`/org/${channelDomain}`)
  }

  return (
    <div
      className="fcs-center inline-flex rounded-md"
      style={{
        background: 'linear-gradient(90deg, rgba(150, 251, 196, 0.7) 0%, rgba(249, 245, 134, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <img
        src={fallbackImage}
        srcSet={course.coverImage}
        alt="course banner"
        className="w-357px h-195px"
        style={{ borderRadius: '6px 6px 0px 0px' }}
      />
      <div className="w-357px flex flex-col items-start justify-start p-24px">
        {/* <RoleTag status={0} /> */}
        <div className="w-full frc-between">
          <div
            className="frc-start cursor-pointer"
            onClick={() => {
              handleJumpOrgIntro(course.channel?.domain)
            }}
          >
            <Image preview={false} fallback={fallbackImage} src={course.channel?.logo} alt={course.channel?.name} width={32} height={32} />
            <span className="font-Anton text-24px leading-32px ml-2">{course.channel?.name}</span>
          </div>
          <div className="uppercase flex-1 inline-flex items-center justify-end font-Anton">
            <span className={`w-fit p-1 ${course.passes?.length ? 'bg-gray-100 border border-solid border-gray-300' : 'h-[32px]'}`}>
              {course.passes?.length ? (
                <span
                  className="text-#6525FF font-ArchivoNarrow flex flex-row items-center text-12px"
                  title={t('includedIn') + course.passes[0].name}
                >
                  <img src={CrownIcon} className="mr-2" style={{ width: '20px', height: '20px' }} alt="NFT Pass" />
                  {course.passes[0].name}
                </span>
              ) : null}
            </span>
          </div>
        </div>
        <div className="w-full mt-4 z-1 flex flex-col items-start justify-start">
          <h1 className="font-ArchivoNarrow text-black text-24px leading-32px h-32px mb-2 one-line-wrap" title={course.title}>
            {course.title}
          </h1>
          <p className="font-ArchivoNarrow text-#000000d8 text-16px leading-20px h-60px three-line-wrap" title={course.description}>
            {course.description}
          </p>
          {loadingDetail || !courseDetail ? <Skeleton /> : <CourseCardDetail courseDetail={courseDetail} />}
          <div className="frc-start">
            <button type="button" className="rounded text-14px text-white bg-#774FF8 mr-4 p-2">
              {t('startLearn')}
            </button>
            {/* <button type="button" className="border border-#00000026 text-14px text-black rounded p-2">
              {t('startForReward')}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
