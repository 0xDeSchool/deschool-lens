import reportErrorLog from '~/api/go/log'
import dayjs from 'dayjs'
import { getUserManager } from '~/account'

type ErrorLog = {
  type: string
  msg: string
  url: string
}
// capture js runtime error
const captureError = (callback: (param: ErrorLog) => void) => {
  console.log('captureError')
  window.onerror = (message, source, lineno, colno, error) => {
    // eslint-disable-next-line no-console
    console.error(message, source, lineno, colno, error)
    const errorMsg = {
      type: 'javascript',
      // msg错误消息，error是错误对象，这里拿的是error.stack(异常信息)
      msg: error?.stack || message,
      // // 发生错误的行数
      // lineno,
      // // 列数，也就是第几个字符
      // colno,
      // 发生错误的页面地址
      url: source,
    } as ErrorLog
    callback(errorMsg)
  }
}

// capture js runtime error
const capturePromise = (callback: (param: ErrorLog) => void) => {
  window.addEventListener('unhandledrejection', event => {
    // eslint-disable-next-line no-console
    const errorMsg = {
      type: 'promise',
      msg: event.reason.stack || event.reason,
    } as ErrorLog
    callback(errorMsg)
  })
}

// capture resource error
const captureResource = (callback: (param: ErrorLog) => void) => {
  window.addEventListener('error', (event: any) => {
    const target = event?.target
    if (target && target !== window) {
      const errorMsg = {
        type: target?.localName,
        url: target.src || target.href,
      } as ErrorLog
      callback(errorMsg)
    }
  })
}

const initMonitor = (callback: Function) => {
  // params add address
  captureError(params => {
    console.log(params)
    callback(params)
  })
  capturePromise(params => {
    console.log(params)
    callback(params)
  })
  captureResource(params => {
    console.log(params)
    callback(params)
  })
}

function registerError() {
  // 本地开发不上报
  if (location.origin.indexOf('booth.ink') === -1) return
  initMonitor((data: any) => {
    const user = getUserManager().user
    reportErrorLog({
      appName: 'Booth-App',
      executionTime: dayjs().format(),
      extra: '',
      level: 1,
      message: data.msg,
      stackTrace: data.url,
      type: data.type,
      user: {
        address: user?.address || '--',
        id: user?.id || '--',
      },
    })
  })
}

export default registerError
