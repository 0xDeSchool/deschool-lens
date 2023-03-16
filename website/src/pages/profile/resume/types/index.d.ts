import type { Dayjs } from 'dayjs'
import type { BlockType } from '../enum'

export interface ResumeBlockInput {
  blockType: BlockType
  dataArr: ResumeCardData[]
  handleEditCard: (BlockType, number) => void
  handleDeleteCard: (BlockType, string) => void
  isEditResume: boolean
  handleCreateCard: (BlockType) => void
  handleSortCard?: (bt: BlockType, list: ResumeCardData[]) => void
}

export interface ResumeCardInput {
  isEditResume: boolean
  handleEditCard: (BlockType, string) => void
  handleDeleteCard: (BlockType, string) => void
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

export interface Project {
  name: string
  url: string
  icon: string
}
export interface ResumeCardData {
  title: string
  projectName: string
  role: string
  description: string
  startTime: Dayjs | undefined
  endTime: Dayjs | undefined
  isPresent: boolean | undefined // 是否至今
  proofs: SbtInfo[] | undefined
  blockType: BlockType | undefined
  id: string
}

export interface SbtInfo {
  address: string
  tokenId: string
  img: string
  name?: string
  description?: string
}
