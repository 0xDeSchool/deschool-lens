import React from 'react'
import Button from 'antd/es/button'
import type { ResumeBlockInput, ResumeCardData } from '../../types'
import { BlockType } from '../../enum'
import ResumeCard from '../resumeCard'

const CAREER_TITLE = 'Career Experience'
const EDU_TITLE = 'Education Experience'

const ResumeBlock = (input: ResumeBlockInput) => {
  const { handleEditCard, handleDeleteCard, isEditResume, dataArr, blockType, handleCreateCard } = input
  // const [editContents, setEditContents] = useState({})
  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between w-full items-center">
        {/* Title */}
        <div className="text-2xl font-bold">{input.blockType === BlockType.CareerBlockType ? CAREER_TITLE : EDU_TITLE}</div>
        {/* Edit / Save Button */}
      </div>

      {/* Resume Card Entires */}
      <div>
        {dataArr?.map((item: ResumeCardData) => (
          <ResumeCard
            key={item.order}
            isEditResume={isEditResume}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            blockType={blockType}
            data={item}
          />
        ))}
      </div>
      {/* 增加框 */}
      {isEditResume && (
        <Button
          type="dashed"
          className="w-full my-8"
          onClick={() => handleCreateCard(blockType, dataArr === undefined ? 1 : dataArr.length + 1)}
        >
          +
        </Button>
      )}
    </div>
  )
}

export default ResumeBlock
