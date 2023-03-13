import message from 'antd/es/message'
import type { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import axios from 'axios'
import Session from '~/utils/session'

const session = new Session()

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_GO_API_URL,
  timeout: 600000, // request timeout
  withCredentials: true,
})

/**
 * 请求拦截z
 */
instance.interceptors.request.use(
  (config: any) => {
    // let customHeader = {}
    // 自定义头部信息
    // if (config.headers)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    // customHeader = handleCustomHeaders(config.headers)

    const headers: RawAxiosRequestHeaders = {}
    // 附带鉴权的token
    // const tokenObj = session.getSession('token', true)
    // const userContext = getUserContext()
    // const tokenInfo = userContext.deschoolProfile?.jwtToken
    // if (tokenInfo) {
    //   headers.Authorization = `Bearer ${tokenInfo}`
    // }

    return {
      ...config,
      headers: {
        ...headers,
        // ...customHeader,
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
    // 401 时没有走这里，直接走了 catch error
    if (err.response.status === 401) {
      session.sessionClear('token', true)
      session.sessionClear('userbar')
      if (err && !err.request.responseURL.includes('/account/my-profile')) {
        message.error('请重新登录后再试')
      }
      return err.data
    }
    // error 中多了 接口返回的 response
    // 首次不用报错
    if (!err.request.responseURL.includes('/account/my-profile')) {
      message.error(err.response.data?.message)
    }
    return err.response.data
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
