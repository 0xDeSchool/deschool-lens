import http from '~/api/booth/http'
import type { NewUserInfo, PagedResult, UserRequest } from "./types";

/**
 * 获取最新用户列表
 * @param page 当前页数
 * @param limit 每页大小
 * @returns
 */
export function getLatestUsers(params: UserRequest): Promise<PagedResult<NewUserInfo>> {
  let query = ""
  if (params.userId) {
    query = `userId=${params.userId}`
  } else {
    query = `page=${params.page || 1}&pageSize=${params.pageSize || 10}`
  }
  if (params.query) {
    query += `&q=${params.query}`
  }
  if (params.platform) {
    query += `&platform=${params.platform}`
  }
  return http.get(`/users?sort=-createdAt&${  query}`)
}
