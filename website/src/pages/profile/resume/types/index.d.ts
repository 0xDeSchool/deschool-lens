import type { BlockType } from '../enum'

export interface ResumeBlockInput {
  blockType: BlockType
  hasAbove: boolean
}

export interface ResumeCardInput {
  isEditBlock: boolean
  handleEditCard: () => void
  handleDeleteCard: () => void
  handleOk: () => void
  handleCancel: () => void
  blockType: BlockType
}

export interface CardEditorInput {
  isEditCard: boolean
  handleOk: () => void
  handleCancel: () => void
}

export interface EditorDataType {
  title: string
  startTime: string
  endTime: string
}
