import Button from 'antd/es/button'
import Image from 'antd/es/image'
import { MatchedCourse } from '~/api/booth/event'
import type { MatchedEvent } from '~/hooks/useCCProfile'
import AvatarList from './AvatarList'
import Tags from './Tags'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import fallbackImage from '~/assets/images/fallbackImage'
import { NextArrowIcon } from '~/components/icon'
import React from 'react'

type RecommnadEventMatchProps = {
  info: MatchedEvent
}

const RecommnadEventMatch: React.FC<RecommnadEventMatchProps> = (props) => {
  const { info } = props
  const count = 10
  const [swiperRef, setSwiperRef] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [swiperWidth, setSwiperWidth] = useState('50vw')
  const boardRef = React.useRef<HTMLDivElement>(null)
  const onStartLearning = (c: MatchedCourse) => {
    window.open(`https://deschool.app/origin/series/${c.seriesId}/learning?courseId=${c.id}`)
  }

  useEffect(() => {
    setSwiperWidth(`${boardRef?.current?.clientWidth} px` || '50vw')
  }, [])

  return (
    <div ref={boardRef} className="flex-1 h-full pr-10 py-16px">
      <h1 className="text-xl font-500 font-Anton mb-8">Match criteria:</h1>
      {info.interested?.length > 0 && <div className="frc-between mb-4">
        <span>Based on your interests in <NavLink className="text-" to="/profile/match">Match</NavLink> on </span>
        <Tags tags={info.interested} />
      </div>}
      {info.matchedUsers && <div className="frc-between mb-4">
        <span>Based on your match</span>
        <div className="frc-start">
          <AvatarList avatarList={info.matchedUsers.users} />
          <span className="flex-1 whitespace-nowrap">xxx +{count} on Booth is also going</span>
        </div>
      </div>}
      {info.followingUsers && <div className="frc-between">
        <span>Based on your following</span>
        <div className="frc-start ">
          <AvatarList avatarList={info.followingUsers.users} />
          <span className="flex-1 whitespace-nowrap"> {info.followingUsers.count} on Booth is also going</span>
        </div>
      </div>}
      <div className="divider w-full h-1px bg-gray-200 my-8" />
      <h1 className="text-xl font-500 font-Anton mb-8">Get prepared on deschool before the event</h1>
      <div className='relative w-100%' style={{width: swiperWidth}}>
        {info?.courses?.length > 0 && <Swiper
            className="mx-auto frc-center"
            onSwiper={setSwiperRef}
            loop={false}
            grabCursor
            centeredSlides
            slidesPerView={1}
            onActiveIndexChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
          {info?.courses?.map((course) => {
            return (<SwiperSlide key={`${course.id}`} style={{width: swiperWidth}} className="mx-auto rounded-16px frc-center">
              <div className="h-200px frc-between gap-4 shadow" style={{width: swiperWidth}}>
                <div className="w-310px flex-0 relative h-full aspect-[433/280] object-cover rounded-2 bg-white shadow">
                  <Image
                    preview={false}
                    src={course?.coverImage || 'https://deschool.s3.amazonaws.com/static/cover_course_event.jpg'}
                    alt="coverImage"
                    className="relative aspect-[433/280] object-cover rounded-2"
                    fallback={'https://deschool.s3.amazonaws.com/static/cover_course_event.jpg'}
                    height={'100%'}
                    width={'100%'}
                    placeholder={
                      <div
                        style={{ width: '100%', height: '100%' }}
                        className="relative aspect-[433/280] object-cover rounded-2 bg-gray-300"
                      />
                    }
                  />
                </div>
                <div className="flex-1 h-full fcs-between py-2">
                  <div className="text-2xl mb-2">{course?.title}</div>
                  <div className="mb-1 font-ArchivoNarrow">{course?.description}</div>
                  <Button type="primary" onClick={() => onStartLearning(course)}>Start Learning</Button>
                </div>
              </div>
            </SwiperSlide>)
          })}
        </Swiper>}
        {(info?.courses?.length > 1 && activeIndex > 0) &&
          <div
            className="swiper-button-prev absolute top-50% translate-y--50% left--36px z-1 w-36px h-36px rounded-50% bg-#181818D9 hover:bg-#18181840 cursor-pointer"
            onClick={() => swiperRef?.slidePrev()}>
            <NextArrowIcon />
          </div>}
        {(info?.courses?.length > 1 && activeIndex + 1 < info?.courses?.length)&& <div
          className="swiper-button-next absolute top-50% translate-y--50% right--42px z-1 w-36px h-36px rounded-50% bg-#181818D9 hover:bg-#18181840 cursor-pointer transform rotate-180"
          onClick={() => swiperRef?.slideNext()}
        >
          <NextArrowIcon />
        </div>}
      </div>
    </div>
  )
}

export default RecommnadEventMatch
