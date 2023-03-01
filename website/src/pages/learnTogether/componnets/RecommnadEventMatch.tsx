import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import AvatarList from './AvatarList'
import Tags from './Tags'

type RecommnadEventMatchProps = {
  info: RecomendedEvents
}

const RecommnadEventMatch: React.FC<RecommnadEventMatchProps> = (props) => {
  const { info } = props
  const count = 10
  const avatarList = ['', '', '']
  const onStartLearning = () => {}

  return (
    <div className="h-full">
      <h1 className="text-xl font-500 font-Anton mb-8">Match criteria:</h1>
      <div className="frc-between mb-4">
        <span>Based on your interests in Match on </span>
        <Tags tags={info.tags} />
      </div>
      <div className="frc-between mb-4">
        <span>Based on your match</span>
        <div className="frc-start">
          <AvatarList avatarList={avatarList} />
          <span className="flex-1 whitespace-nowrap">xxx +{count} on Booth is also going</span>
        </div>
      </div>
      <div className="frc-between">
        <span>Based on your following</span>
        <div className="frc-start ">
          <AvatarList avatarList={avatarList} />
          <span className="flex-1 whitespace-nowrap">xxx +{count} on Booth is also going</span>
        </div>
      </div>
      <div className="divider w-full h-1px bg-gray-200 my-8" />
      <h1 className="text-xl font-500 font-Anton mb-8">Get prepared on deschool before the event</h1>
      <div className="frc-between gap-4">
        <img className="h-120px aspect-[433/280] object-cover rounded-2" src="https://deschool.s3.amazonaws.com/seriesCovers/6323d96759c18e0e54fd677a33a1ad4e-a682-48a7-8bfb-56b9e01c16b7.jpg" alt="course cover"/>
        <div className="h-120px fcs-between">
          <div className="text-2xl mb-2">How to build a startup in 2021</div>
          <div className="mb-1">course description xxx</div>
          <Button type="primary" onClick={() => onStartLearning()}>Start Learning</Button>
        </div>
        <div>right</div>
      </div>
    </div>
  )
}

export default RecommnadEventMatch
