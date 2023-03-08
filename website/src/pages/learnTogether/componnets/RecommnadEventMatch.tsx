import Button from 'antd/es/button'
import Image from 'antd/es/image'
import { MatchedCourse } from '~/api/booth/event'
import type { MatchedEvent } from '~/hooks/useCCProfile'
import AvatarList from './AvatarList'
import Tags from './Tags'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import fallbackImage from '~/assets/images/fallbackImage'
import { NextArrowIcon } from '~/components/icon'
import SkeletonImage from 'antd/es/skeleton/Image'

type RecommnadEventMatchProps = {
  info: MatchedEvent
}

const RecommnadEventMatch: React.FC<RecommnadEventMatchProps> = (props) => {
  const { info } = props
  const count = 10
  const [swiperRef, setSwiperRef] = useState<any>(null)

  const onStartLearning = (c: MatchedCourse) => {
    window.open(`https://deschool.app/origin/series/${c.seriesId}/learning?courseId=${c.id}`)
  }

  return (
    <div className="flex-1 h-full pr-10 pt-16px">
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
      <div className='relative'>
        {info?.courses?.length > 0 && <Swiper
            className="w-full mx-auto frc-center"
            onSwiper={setSwiperRef}
            loop
            effect={'coverflow'}
            modules={[EffectCoverflow]}
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
          >
          {info?.courses?.map((course) => {
            return (<SwiperSlide key={`${course.id}`} className="mx-auto rounded-16px frc-center">
              <div className="frc-between gap-4">
                <div className="relative h-240px aspect-[433/280] object-cover rounded-2 bg-white shadow">
                  <Image
                    preview={false}
                    src={course?.coverImage}
                    alt="coverImage"
                    className="relative aspect-[433/280] object-cover rounded-2"
                    fallback={fallbackImage}
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
                <div className="h-160px fcs-between">
                  <div className="text-2xl mb-2">{course?.title}</div>
                  <div className="mb-1">{course?.description}</div>
                  <Button type="primary" onClick={() => onStartLearning(course)}>Start Learning</Button>
                </div>
              </div>
            </SwiperSlide>)
          })}
        </Swiper>}
        {info?.courses?.length > 1 && <div className="absolute top-50% translate-y--50% left-0 z-1 w-36px h-36px rounded-50% bg-#181818D9 hover:bg-#18181840 cursor-pointer" onClick={() => swiperRef?.slidePrev()}>
          <NextArrowIcon />
        </div>}
        {info?.courses?.length > 1 && <div
          className="absolute top-50% translate-y--50% right-0 z-1 w-36px h-36px rounded-50% bg-#181818D9 hover:bg-#18181840 cursor-pointer transform rotate-180"
          onClick={() => swiperRef?.slideNext()}
        >
          <NextArrowIcon />
        </div>}
      </div>
    </div>
  )
}

export default RecommnadEventMatch
