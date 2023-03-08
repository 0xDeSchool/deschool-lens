import Button from 'antd/es/button'
import { useState } from 'react'
import { MatchedCourse } from '~/api/booth/event'
import type { MatchedEvent } from '~/hooks/useCCProfile'
import AvatarList from './AvatarList'
import Tags from './Tags'
import { NavLink } from 'react-router-dom'

const defatulCourseCover = "https://deschool.s3.amazonaws.com/courseCovers/default.png"

type RecommnadEventMatchProps = {
  info: MatchedEvent
}

const RecommnadEventMatch: React.FC<RecommnadEventMatchProps> = (props) => {
  const { info } = props
  const [courseIndex, setCourseIndex] = useState<number>(0)

  const onStartLearning = (c: MatchedCourse) => {
    window.open(`https://deschool.app/origin/series/${c.seriesId}/learning?courseId=${c.id}`)
  }

  return (
    <div className="flex-1 h-full pr-10">
      <h1 className="text-xl font-500 font-Anton mb-8">Match criteria:</h1>
      {info.interested?.length > 0 && <div className="frc-between mb-4">
        <span>Based on your interests in <NavLink className="text-" to="/profile/match">Match</NavLink> on </span>
        <Tags tags={info.interested} />
      </div>}
      {info.matchedUsers && <div className="frc-between mb-4">
        <span>Based on your match</span>
        <div className="frc-start">
          <AvatarList avatarList={info.matchedUsers.users} />
          <span className="flex-1 whitespace-nowrap">xxx +{info.matchedUsers.count} on Booth is also going</span>
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
      {info.courses && info.courses.map(c => {
        return <div className="frc-between gap-4">
          {/* <div className="w-36px h-36px rounded-50% bg-#FFFFFF26 hover:bg-#FFFFFF73 cursor-pointer"
          style={{ visibility: courseIndex === 0 ? 'hidden' : 'visible' }}
          onClick={() => { setCourseIndex(courseIndex > 0 ? courseIndex - 1 : 0) }}>
          <ArrowLeftIcon />
        </div> */}
          <img className="h-120px aspect-[433/280] object-cover rounded-2"
            src={c.coverImage ? c.coverImage : defatulCourseCover}
            alt="course cover" />
          <div className="h-120px fcs-between">
            <div className="text-2xl mb-2">{c.title}</div>
            <div className="mb-1 two-line-wrap">{c.description}</div>
            <Button type="primary" onClick={() => onStartLearning(c)}>Start Learning</Button>
          </div>
          {/* <div className="w-36px h-36px rounded-50% bg-#FFFFFF26 hover:bg-#FFFFFF73 cursor-pointer"
            style={{ visibility: courseIndex >= info.courses.length - 1 ? 'hidden' : 'visible' }}
            onClick={() => { setCourseIndex(courseIndex + 1) }} >
            <ArrowRightIcon />
          </div> */}
        </div>
      })}
    </div>
  )
}

export default RecommnadEventMatch
