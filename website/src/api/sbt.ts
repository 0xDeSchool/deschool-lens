import http from '~/api/http'
import type { CoursePoskDetail } from '~/lib/types/app'

/**
 * @method getSBTList
 * @description 从后台获取指定组织的posks列表
 * @param {string} orgId
 * @param {string} seriesId
 * @returns {Object} Promise
 */
export async function getSBTList(orgId: string, seriesId: string, currentSBT?: string): Promise<CoursePoskDetail[]> {
  return http.get(`/sbt/by-series?orgId=${orgId}&seriesId=${seriesId}&currSBT=${currentSBT ?? ''}`)
}

/**
 * @method getPoskInfoById
 * @description 从后台获取指定posk的详情
 * @param {string} sbtId
 * @returns {Object} Promise
 */
export async function getSbtInfoById(sbtId: string, pageSize: number, page: number): Promise<CoursePoskDetail> {
  return http.get(`/sbt/${sbtId}/owners?pageSize=${pageSize}&page=${page}`)
}

/**
 * @method getPassInfoById
 * @description 从后台获取指定pass的详情
 * @param {string} passId
 * @returns {Object} Promise
 */
export async function getPassInfoById(passId: string, limit: number, cursor: string): Promise<CoursePoskDetail> {
  const url = `/passes/${passId}/detail?limit=${limit}&cursor=${cursor}`
  return http.get(url)
}

export default {}
