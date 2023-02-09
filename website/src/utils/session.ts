interface ObjectType {
  [key: string]: any
}

class Session {
  /**
   * 加密数据
   * @param {any} data 转为base64数据
   */
  // eslint-disable-next-line class-methods-use-this
  encrypt(data: string) {
    // eslint-disable-line class-methods-use-this
    const set = encodeURIComponent(data)
    const result = window.btoa(set)
    return result
  }

  /**
   * 解码数据
   * @param {any} data 数据
   */
  // eslint-disable-next-line class-methods-use-this
  MyLocker(data: string) {
    // eslint-disable-line class-methods-use-this
    try {
      const jieMi = atob(data)
      const jieM = decodeURIComponent(jieMi)
      return jieM
    } catch (e) {
      throw Error('解码出错')
    }
  }

  /**
   *  根据参数区分存储对象
   * @param isSession
   * @returns {Storage} 默认不传值 返回 sessionStorage 存储对象，true=>返回 localStorage
   */
  // eslint-disable-next-line class-methods-use-this
  sessionType(isSession: boolean = false) {
    // eslint-disable-line class-methods-use-this
    return isSession ? localStorage : sessionStorage
  }

  /**
   * 判断该当前的key 是否存在
   * @param key
   * @constructor
   */
  // eslint-disable-next-line class-methods-use-this
  ISKET(key: string) {
    // eslint-disable-line class-methods-use-this
    if (!key) {
      throw Error('请传入Session的KEY!!!')
    }
  }

  /**
   * Session存储方法
   * @param key 存储的key值
   * @param setObj 存储的数据
   * @param isSession 存储 localStorage 还是 sessionStorage 默认 sessionStorage
   */
  setSession(key: string, setObj: ObjectType | string, isSession: boolean = false) {
    this.ISKET(key)
    let setObjStr = ''
    if (Object.keys(setObj).length > 0) {
      setObjStr = JSON.stringify(setObj)
    }

    this.sessionType(isSession).setItem(this.encrypt(key), this.encrypt(setObjStr))
  }

  /**
   * 获取存储的值
   * @param key 存储的key
   * @param isSession  存储 localStorage 还是 sessionStorage 默认 sessionStorage
   * @returns {any} 返回对应的key 的数据
   */
  getSession(key: string, isSession: boolean = false) {
    this.ISKET(key)
    const data = this.sessionType(isSession).getItem(this.encrypt(key))
    if (data) {
      try {
        return JSON.parse(this.MyLocker(data))
      } catch (e) {
        console.error('getSession方法获取数据错误') // eslint-disable-line no-console
        return false
      }
    }
  }

  sessionClear(key: string, isSession: boolean = false) {
    this.ISKET(key)
    this.sessionType(isSession).removeItem(this.encrypt(key))
  }

  sessionClearAll(isSession: boolean = false) {
    this.sessionType(isSession).clear()
  }
}
export default Session

export const defaultSession = new Session()
