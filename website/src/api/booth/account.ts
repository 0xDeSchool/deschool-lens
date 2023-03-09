import http from "./http";
import type { LinkPlatformRequest, LoginRequest, LoginResponse, LogoutResponse, SignMsgType, UpdateUserInfo, UserInfo } from "./types";

export function getSignMessage(params: { address: string, signType: SignMsgType }): Promise<{ message: string }> {
  return http.post('/sign-msg', params)
}

export function login(request: LoginRequest): Promise<LoginResponse> {
  return http.post('/login', request)
}

export function logout(): Promise<LogoutResponse> {
  return http.post('/logout', {})
}

export function refreshToken(): Promise<void> {
  return http.post('/refresh-token', {})
}

export function getUserInfo(userId?: string): Promise<UserInfo> {
  const url = userId ? `/identity?user=${userId}` : '/identity'
  return http.get(url)
}

export function updateUserInfo(request: UpdateUserInfo): Promise<{}> {
  return http.put('/identity', request)
}

export function linkPlatform(request: LinkPlatformRequest): Promise<{}> {
  return http.post('/identity/link', request)
}

export function unlinkPlatform(request: LinkPlatformRequest): Promise<{}> {
  return http.delete('/identity/link', { data: request })
}


