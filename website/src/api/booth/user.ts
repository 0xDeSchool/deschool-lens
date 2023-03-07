import http from "./http";
import type { NewUserInfo, PagedResult} from "./types";
import { UserInfo } from "./types";

/**
 * 获取最新用户列表
 * @param page 当前页数
 * @param limit 每页大小
 * @returns
 */
export function getLatestUsers(page: number, limit: number): Promise<PagedResult<NewUserInfo>> {
  return http.get(`/users?sort=-createdAt&page=${page}&pageSize=${limit}`)
}
