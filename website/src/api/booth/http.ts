import type { AxiosInstance, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import message from 'antd/es/message'
import axios from 'axios'
import { getLanguage } from '~/utils/language'
import ZH_CN_COMMON from '~/locales/zh-CN/request'
import EN_US_COMMON from '~/locales/en-US/request'
import { getToken } from '~/account'

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_GO_BOOTH_API_URL,
  timeout: 600000, // request timeout
  withCredentials: true,
})

/**
 * 请求拦截z
 */
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const headers: RawAxiosRequestHeaders = {}
    // 附带鉴权的token
    // const tokenObj = session.getSession('token', true)
    const tokenInfo = getToken()
    if (tokenInfo && tokenInfo.token) {
      headers.Authorization = `Bearer ${tokenInfo.token}`
    }
    return {
      ...config,
      headers: {
        ...headers,
      },
    }
  },
  error => Promise.reject(error),
)

/**
 * 响应拦截
 */
instance.interceptors.response.use(
  v => {
    if (v.status >= 200 && v.status < 300) return v.data

    return Promise.reject(v)
  },
  err => {
    const lng = getLanguage()
    if (lng === 'zh_CN') {
      message.error(ZH_CN_COMMON[err.response.status as keyof typeof ZH_CN_COMMON])
    } else {
      message.error(EN_US_COMMON[err.response.status as keyof typeof ZH_CN_COMMON])
    }
    // if (err.response.data) {
    //   return undefined
    // }
    console.log('url', err.config.url)
    return undefined
  },
)

/**
 * 添加自定义 headers
 * @param headers AxiosRequestHeaders
 * @returns AxiosRequestHeaders
 */
// function handleCustomHeaders(headers: RawAxiosRequestHeaders | AxiosHeaders): RawAxiosRequestHeaders {
//   const newHeaders: RawAxiosRequestHeaders = {}
//   const defaultHeaders = ['common', 'delete', 'get', 'head', 'patch', 'post', 'put']
//   // eslint-disable-next-line no-restricted-syntax
//   for (const key in headers) {
//     if (!defaultHeaders.includes(key)) newHeaders[key] = headers[key]
//   }
//   return newHeaders
// }
export default instance
