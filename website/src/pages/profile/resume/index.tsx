import Divider from 'antd/es/divider'
import ResumeBlock from './components/resumeBlock'
import { BlockType } from './enum'

type ResumeProp = {
  handle?: string
}

const Resume = (props: ResumeProp) => {
  const { handle } = props
  return (
    <div className="bg-white p-8">
      <div>Resume Handle: {handle}</div>
      <ResumeBlock blockType={BlockType.CareerBlockType} hasAbove={false} />
      <Divider />
      <ResumeBlock blockType={BlockType.EduBlockType} hasAbove />
    </div>
  )
}

export default Resume
