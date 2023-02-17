interface DateTimeType {
  [key: string]: number
}
/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
export function formatDate(date: Date, fmt: string = 'yyyy-MM-dd HH:mm:ss') {
  date = date === undefined ? new Date() : date
  date = typeof date === 'number' ? new Date(date) : date
  date = typeof date === 'string' ? new Date(parseInt(date, 10)) : date
  const obj: DateTimeType = {
    y: date.getFullYear(), // 年份，注意必须用getFullYear
    M: date.getMonth() + 1, // 月份，注意是从0-11
    d: date.getDate(), // 日期
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    w: date.getDay(), // 星期，注意是0-6
    H: date.getHours(), // 24小时制
    h: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    m: date.getMinutes(), // 分钟
    s: date.getSeconds(), // 秒
    S: date.getMilliseconds(), // 毫秒
  }
  const week = ['天', '一', '二', '三', '四', '五', '六']
  Object.keys(obj).forEach(i => {
    fmt = fmt.replace(new RegExp(`${i}+`, 'g'), m => {
      const val = obj[i]
      if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
      let valStr = val.toString()
      for (let j = 0, len = valStr.length; j < m.length - len; j++) valStr = `0${valStr}`
      return m.length === 1 ? valStr : valStr.substring(valStr.length - m.length)
    })
  })
  return fmt
}

/**
 * @description 异步形式返回图片的Base64编码
 * @param {Object} file 图片文件流
 * @returns {Object} Promise
 */
export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

/**
 * @description 获取裁剪后的地址
 * @param {string}
 * @returns {string}
 */
export function getShortAddress(address: string | undefined | null) {
  return address ? `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}` : ''
}
