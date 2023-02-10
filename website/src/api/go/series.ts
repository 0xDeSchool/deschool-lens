import type { CoursePostParticipationInput, CourseSeriesCreateInput, CourseSeriesDetail } from '~/lib/types/app'
import http from './http'

/** **************** Series start******************* */
/**
 * @method postSeries
 * @description 提交series信息
 * @param {Object}
 * @returns {Object} Promise
 */
export async function postSeries(params: CourseSeriesCreateInput) {
  return http.post(`/series`, params)
}

/**
 * @method getOrganizations
 * @description 从后台获取组织结构列表
 * @return {Object} Promise
 */
export async function getOrganizations() {
  return http.get(`/series/orgs`)
}

/**
 * @method getSeriesBySubOrgId
 * @description 从后台获取指定subOrg的series列表
 * @param {Object} { orgId: string,tags?:string, page?: number, pageSize?: number}
 * @return {Object} Promise
 */
export async function getSeriesBySubOrgId(params: { orgId: string; tags?: string; page?: number; pageSize?: number }) {
  if (params.tags) {
    return http.get(`/series/by-org/${params.orgId}?tags=${params.tags}`)
  }
  return http.get(`/series/by-org/${params.orgId}`)
}

/**
 * description 获取指定 series 的详细信息
 * @param {*} params
 * @returns {object} Promise
 */
export async function getSeriesDetail(params: { seriesId: string }, query?: string): Promise<CourseSeriesDetail> {
  return http.get(`/series/${params.seriesId}/detail${query !== undefined ? `?${query}` : ''}`)
}

/**
 * @method getSeriesPolicies
 * @description 从后台获取一系列课程的权限策略
 * @param {Object} { seriesId: string }
 * @returns {Object} Promise
 */
export async function getSeriesPolicies(params: { seriesId: string }) {
  return http.get(`/series/${params.seriesId}/policies`)
}

/**
 * @method postSeriesParticipation
 * @description 增加series的participation
 * @param {Object}
 * @returns {Object} Promise
 */
export async function postSeriesParticipation(params: CoursePostParticipationInput, seriesId: string) {
  return http.post(`series/${seriesId}/participation`, params)
}

/**
 * @method deleteSeriesParticipation
 * @description 删除series的participation（主要用于Like的取消）
 * @param {Object}
 * @returns {Object} Promise
 */
export async function deleteSeriesParticipation(params: CoursePostParticipationInput, seriesId: string) {
  return http.delete(`series/${seriesId}/participation`, { data: params }) // delete body传参用data, 路径传参params
}

/**
 * @method getSeriesInfo
 * @description 从后台获取指定series的基本信息
 * @param {Object} { seriesId: string }
 * @returns {Object} Promise
 */
export async function getSeriesInfo(params: { seriesId: string }) {
  return http.get(`series/${params.seriesId}`)
}
/** **************** Series end******************* */
