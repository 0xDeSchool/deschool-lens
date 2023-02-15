import type { Dayjs } from 'dayjs'
import type { BlockType } from '../enum'

export interface ResumeBlockInput {
  blockType: BlockType
  dataArr: ResumeCardData[] | undefined
  handleEditCard: (BlockType, number) => void
  handleDeleteCard: (bt: BlockType, order: number) => void
  isEditResume: boolean
  handleCreateCard: (bt: BlockType, order: number) => void
}

export interface ResumeCardInput {
  isEditResume: boolean
  handleEditCard: (BlockType, number) => void
  handleDeleteCard: (bt: BlockType, order: number) => void
  blockType: BlockType
  data: ResumeCardData
}

export interface CardEditorInput {
  isEditCard: boolean
  handleOk: (newData: ResumeCardData) => void
  handleCancel: () => void
  originalData: ResumeCardData | undefined
  isCreateCard: boolean
  sbtList: SbtInfo[]
}

export interface ResumeData {
  career: ResumeCardData[] | undefined
  edu: ResumeCardData[] | undefined
}

export interface ResumeCardData {
  title: string
  description: string
  startTime: Dayjs | undefined
  endTime: Dayjs | undefined
  proofs: SbtInfo[] | undefined
  blockType: BlockType | undefined
  order: number | undefined
}

export interface SbtInfo {
  address: string
  tokenId: string
  img: string
}
