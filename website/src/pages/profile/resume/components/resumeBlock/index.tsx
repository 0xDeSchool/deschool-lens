import React, { useState } from 'react'
import Button from 'antd/es/button'
import type { ResumeBlockInput } from '../../types'
import { BlockType } from '../../enum'
import ResumeCard from '../resumeCard'
import CardEditor from '../cardEditor'

const CAREER_TITLE = 'Career Experience'
const EDU_TITLE = 'Education Experience'

const ResumeBlock = (input: ResumeBlockInput) => {
  const [isEditBlock, setIsEditBlock] = useState(false)
  const [isEditCard, setIsEditCard] = useState(false)
  // const [editContents, setEditContents] = useState({})

  const onClickButton = () => {
    setIsEditBlock(!isEditBlock)
  }

  // TODO:
  const handleEditCard = () => {
    console.log('Edit Card')
    setIsEditCard(true)
  }

  // TODO:
  const handleDeleteCard = () => {
    console.log('Delete Card')
  }

  // TODO:
  const handleOk = () => {
    console.log('Handle OK')
    setIsEditCard(false)
  }

  // TODO:
  const handleCancel = () => {
    console.log('Handle Cancel')
    setIsEditCard(false)
  }

  return (
    <div className={`w-full ${input.hasAbove ? 'mt-10' : ''}`}>
      {/* Header */}
      <div className="flex justify-between w-full items-center">
        {/* Title */}
        <div className="text-lg font-bold">{input.blockType === BlockType.CareerBlockType ? CAREER_TITLE : EDU_TITLE}</div>
        {/* Edit / Save Button */}
        <Button onClick={onClickButton}> {isEditBlock ? 'Save' : 'Edit'} </Button>
      </div>

      {/* Resume Card Entires */}
      <div>
        {[0].map(() => (
          <ResumeCard
            key={0}
            isEditBlock={isEditBlock}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            handleOk={handleOk}
            handleCancel={handleCancel}
            blockType={input.blockType}
          />
        ))}
      </div>

      {/* 编辑框 */}
      <CardEditor isEditCard={isEditCard} handleOk={handleOk} handleCancel={handleCancel} />
    </div>
  )
}

export default ResumeBlock
