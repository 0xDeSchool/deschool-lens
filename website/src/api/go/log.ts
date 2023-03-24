import http from '~/api/go/http'

export interface ErrorLog {
  appName: string
  executionTime: string
  extra: string
  level: number
  message: string
  stackTrace: string
  type: string
  user: {
    address: string
    id: string
    name: string
  }
}

/**
 * @method reportErrorLog
 * @description 向后台上报补获的错误信息
 * @param {Object}
 * @returns {Object}  Promise
 */
async function reportErrorLog(params: ErrorLog) {
  return http.post(`/app-logs`, params)
}

export default reportErrorLog
