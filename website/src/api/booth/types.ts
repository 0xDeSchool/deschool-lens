import { PlatformType } from "./booth";

export enum SignMsgType {
  LOGIN = 'login',
  LINK = 'link',
}

export interface LoginRequest {
  address: string;
  sig: string;
  walletType?: string;
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
  // 附加数据
  data: { [key: string]: string }
}

export interface UserInfo {
  address: string
  displayName: string
  avatar: string
  bio: string
  platforms: UserPlatform[]
}

export interface UpdateUserInfo {
  displayName: string
  avatar: string
  bio: string
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
  // 当前签名的钱包类型
  walletType?: string
  signHex: string
  data: { [key: string]: string }  // 附加数据
}

export interface UnlinkPlatformRequest {
  // 对应平台的用户标识
  handle: string
  // 平台唯一标识，如 lens, cc(CyberConnect), deschool
  platform: PlatformType
}
