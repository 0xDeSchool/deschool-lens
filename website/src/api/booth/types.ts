import type { PlatformType } from "./booth";
import type { EventUserItem as UserItem } from "./event";

export enum SignMsgType {
  LOGIN = 'login',
  LINK = 'link',
}

export interface ErrorResult {
  code: number
  message: string
  data?: any
}

export interface pageRequest {
  page?: number
  pageSize?: number
  sort?: string
}

export type SearchRequest = pageRequest & {
  query?: string
}

export function searchQuery(r: SearchRequest): string {
  const ps = new URLSearchParams()
  if (r.page) {
    ps.append('page', r.page.toString())
  }
  if (r.pageSize) {
    ps.append('pageSize', r.pageSize.toString())
  }
  if (r.query) {
    ps.append('q', r.query)
  }
  return ps.toString()
}

export interface CreatedResult {
  id: string
}

export interface LoginRequest {
  address: string;
  sig: string;
  walletType?: string;
  platform?: LinkPlatformRequest;
}

export interface LogoutResponse {
  code: number
  success: boolean
}

export interface UserPlatform {
  // 对应平台的用户标识
  handle: string
  // 平台唯一标识，如 lens, cc(CyberConnect), deschool
  platform: PlatformType
  address: string
  displayName?: string
  avatar?: string
  bio?: string
  // 附加数据
  data: { [key: string]: string }
}

export interface PagedResult<T> {
  hasNext: boolean
  items: T[]
}

export interface Contact {
  contactType: string
  name: string
  description?: string
  icon?: string
  url?: string
}

export interface UserInfo {
  id: string
  address: string
  displayName?: string
  avatar?: string
  bio?: string
  platforms?: UserPlatform[]
  contacts?: Contact[]
}

// 新用户信息
export interface NewUserInfo extends UserInfo {
  followerCount: number
  followingCount: number
  isFollowing: boolean
}

export function platform(u: UserInfo, t: PlatformType): UserPlatform | undefined {
  if (u.platforms) {
    return u.platforms.find(p => p.platform === t)
  }
  return undefined
}

export interface UpdateUserInfo {
  displayName?: string
  avatar?: string
  bio?: string
}

export interface LoginResponse {
  jwtToken: string
  displayName: string
  avatar: string
  address: string
}

export interface LinkPlatformRequest {
  // 对应平台的用户标识
  handle: string
  // 平台唯一标识，如 lens, cc(CyberConnect), deschool
  platform: PlatformType
  // 当前签名的钱包地址
  address: string
  // 名称
  displayName?: string | null
  // 头像
  avatar?: string | null
  // 当前签名的钱包类型
  walletType?: string
  signHex?: string
  data?: { [key: string]: string }  // 附加数据
}

export interface UnlinkPlatformRequest {
  // 对应平台的用户标识
  handle: string
  // 平台唯一标识，如 lens, cc(CyberConnect), deschool
  platform: PlatformType
}


export interface UserFollower {
  vistorFollowedPerson: boolean
  personFollowedVistor: boolean
  follower?: UserItem
}

export interface UserFollowing {
  vistorFollowedPerson: boolean
  personFollowedVistor: boolean
  following?: UserItem
}

export interface UserRequest {
  query?: string
  page?: number
  pageSize?: number
  userId?: string
  platform?: PlatformType
}

export interface ResumeProjectBase {
  name: string
  description?: string
  url?: string
  icon?: string
}

export interface ResumeProjectCreateRequest extends ResumeProjectBase {
}

export type ResumeProject = ResumeProjectBase & {
  id: string
}


export interface ResumeRoleBase {
  name: string
  description?: string
}

export interface ResumeRoleCreateRequest extends ResumeRoleBase {
}

export type ResumeRole = ResumeRoleBase & {
  id: string
}
