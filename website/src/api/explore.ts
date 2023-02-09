import http from '~/api/http'

/**
 * @method getExplore
 * @description 获取explore信息
 * @returns {Object} Promise
 */
export async function getExplore() {
  return http.get(`/explore`)
}

/**
 * @method getExploreSearch
 * @description 搜索获取explore信息
 * @returns {Object} Promise
 */
export async function getExploreSearch(q: string, limit?: number) {
  return http.get(`/explore/search?q=${q}&limit=${limit || 5}`)
}

/**
 * @method getExplore
 * @description 获取explore信息
 * @returns {Object} Promise
 */
export async function getExploreChannels(page: number, pageSize: number, sort: string) {
  return http.get(`/explore/channels?page=${page}&pageSize=${pageSize}&sort=${sort}`)
}

/**
 * @method getExplore
 * @description 获取 explore 课程信息
 * @returns {Object} Promise
 */
export async function getExploreCourses(page: number, pageSize: number, sort: string) {
  return http.get(`/explore/courses?page=${page}&pageSize=${pageSize}&sort=${sort}`)
}

/**
 * @method getExplore
 * @description 获取 explore 系列课程信息
 * @returns {Object} Promise
 */
export async function getExploreSeries(page: number, pageSize: number, sort: string) {
  return http.get(`/explore/series?page=${page}&pageSize=${pageSize}&sort=${sort}`)
}

/**
 * @method getExplore
 * @description 获取 explore 课程信息卡片内详情
 * @returns {Object} Promise
 */
export async function getExploreCoursesDetail(data: { ids: string[] }) {
  return http.post(`/explore/courses/learning-detail`, data)
}

/**
 * @method getExplore
 * @description 获取 explore 系列课程信息卡片内详情
 * @returns {Object} Promise
 */
export async function getExploreSeriesDetail(data: { ids: string[] }) {
  return http.post(`/explore/series/learning-detail`, data)
}
