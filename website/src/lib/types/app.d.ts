import type { Profile } from '~/api/lens/graphql/generated'

export type ContractType = 'ERC20' | 'ERC721' | 'ERC1155'

export interface LayoutContextProps {
  theme: string
  currentWidth: number
  currentHeight: number
  connectBoardVisible: boolean
  layoutPosition: Position
  setConnectBoardVisible: Dispatch<SetStateAction<boolean>>
  setCurrentWidth: Dispatch<SetStateAction<number>>
  setCurrentHeight: Dispatch<SetStateAction<number>>
  setTheme: Dispatch<SetStateAction<string>>
  setLayoutPosition: Dispatch<SetStateAction<Position>>
}

export interface Contact {
  contactType: string
  url: string
}

export interface Creator {
  id?: string
  address: string
  avatar: string
  username: string
  bio?: string
}

export interface NFT {
  amount: string
  metadata: string
  name: string
  normalized_metadata: {
    description: string
    image: string
    name: string
  }
  token_address: string
}

export interface Series {
  _id: string
  id: string
  name: string
  belongTo: string
  category: any[]
  coverImage: string
  createdAt: string
  creator: Creator
  author?: Creator // go接口调整后字段变化creator -> author
  creatorId: string
  description: string
  estTime: number
  language: string
  liked: boolean
  orgId: string
  progress: number
  resource: Resource
  resourceId: string
  status: int
  subOrgId: string
  title: string
  updatedAt: string
  whatToLearn: string[]
  tags: Tag[]
  passes?: SeriesPassItem[]
  access?: boolean
}

export interface SeriesPassItem {
  condition: number
  description: string
  id: string
  name: string
  status: number
  type: string
  contractAddr?: string
  contractType?: ContractType
  passShow?: string
  status?: number
  tokenId?: number
  isExternal: boolean
}

export interface Pass {
  id: string
  chainId: string
  contractAddr: string
  contractType: string
  type: string
  description: string
  passShow: string
  notices: string[]
  owners: OwnerRecord[]
  detail: string
  discount: number
  orgId: string
  mintedCount: number
  name: string
  price: number
  tokenId: number
  totalCount: number
}

export interface OwnerRecord {
  id: string
  address?: string
  username?: string
  avatar: string
  introduction?: string
  bio?: string
  count?: number
}

export interface ExploreStudyInfo {
  courseCount: number // 课程数量
  length: number // 学习时长
  startedCount: number // 开始学习的用户数量
  startedUsers: User[] // 开始学习的用户数量
  studyProgress: number // 学习进度
}

export interface CourseCoursePolicyDetail {
  /**
   * 合约地址
   */
  contractAddr?: string
  description?: string
  /**
   * 折扣, 百分比小数, 如 0.1(一折), 默认为 1
   */
  discount?: number
  id?: string
  mintedCount?: number
  name?: string
  /**
   * 单价, 单位?
   */
  price?: number
  /**
   * nft对于的tokenId
   */
  tokenId?: string
  /**
   * 总量，-1表示无限量
   */
  totalCount?: number
  type?: string
  detail: string
  notices: [string]
  orgId: string
  passShow: string
  url: string
}

export interface SeriesExtend extends Series {
  channel: Org
}

export interface Orgs {
  id?: string
  title: string
  name?: string
  bgImage: string
  description: string
  logo: string
  subOrgs: SubOrg[]
}

export interface Org {
  id: string
  name: string
  bgImage: string
  logo: string
  tags: Tag[]
  description: string
  englishDescription: string
  contacts?: Contact[]
  courses?: any[]
  status?: number
  email: string
  domain: string
  data?: Record<string, any>
}

export interface Tag {
  id: string
  name: string
  [x: string]: ReactI18NextChild | Iterable<ReactI18NextChild>
}

export interface ExploreCourse extends CourseInfo {
  id: string
  passes?: Pass[]
  resource?: Resource
  seriesId: string
  channel: Org
}
export interface CourseInfo {
  courseStatus: number
  coverImage: string
  creator: Creator[]
  description: string
  language: string
  likes: number
  nextCourse: any
  posks: Posk[]
  rating: Rating
  sgCategory: SgCategoryOrigin[]
  success: boolean
  title: string
  totalEnrolled: number
  whatToLearn: string[]
}

export interface CoursePoskDetail {
  description?: string
  id?: string
  metadata?: string
  name?: string
  url?: string
  ownersCount?: number
  tokenId?: string
}

export interface CourseSeriesCreateInput {
  id?: string
  authorId?: string
  coverImage?: string
  description?: string
  language?: string
  order?: number
  orgId: string
  status?: number
  studyType?: number
  title: string
  whatToLearn?: Array<string>
  tags?: string[]
}

export interface CourseSeriesDetail {
  belongTo?: string
  courses: Array<CourseDetail>
  coverImage?: string
  createdAt?: string
  creator?: Creator
  id?: string
  language?: string
  order?: number
  orgId?: string
  posks?: Array<CoursePoskDetail>
  resource?: CourseSeriesResource
  resourceId?: string
  status?: string
  studyType?: number
  title?: string
  description?: string
  whatToLearn?: Array<string>
  userActions: {
    isEnrolled: boolean
    isCompleted: boolean
    isLiked: boolean
  }
  passes: SeriesPassItem[]
}

export interface CoursePostParticipationInput {
  /**
   * 用户 Participation 交互信息数组
   */
  updates: Array<CourseParticipationUpdateInput>
}

export interface ProfileExtend extends Profile {
  avatarUrl?: string
  coverUrl?: string
}
