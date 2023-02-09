import http from '~/api/http'
/**
 * @method getNonceByUserAddress
 * @description 从后台获取nonce
 * @description login by nonceSig: get nonce from backend，sign it and return to the background for authentication, and log in
 * @param {Object} { address: string }
 * @returns {Object} Promise
 */
export async function getNonceByUserAddress(params: { address: string }) {
  return http.get(`/login-nonce/${params.address}`)
}

/**
 * @method postNonceSigByUserAddress
 * @description 前端对nouce签名, 返回到后台验证后登录
 * @param {Object} { address: number, sig: string }
 * @returns {Object} Promise
 */
export async function postNonceSigByUserAddress(params: { walletType: string; address: string; sig: string }) {
  return http.post(`/login`, params)
}

/**
 * @method deleteJwtByUserAddress
 * @description 通过后台接口更新有效期为0的jwt实现退出登录
 * @param {Object}
 * @returns {Object} Promise
 */
export async function deleteJwtByUserAddress() {
  return http.post(`/logout`)
}

/**
 * @method getUserCustomData
 * @description 获取用户自定义数据
 * @param {Object}
 * @returns {Object} Promise
 */
export async function getUserCustomData(params: { key: string }) {
  return http.get(`/user-data/${params.key}`)
}

/**
 * @method postUserCustomData
 * @description 上传用户自定义数据
 * @description
 * @param {Object} { key: string; data: Object }
 * @returns {Object} Promise
 */
export async function postUserCustomData(params: { key: string; data: Object }) {
  return http.post(`/user-data/${params.key}`, { data: params.data })
}
