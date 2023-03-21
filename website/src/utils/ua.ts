 /**
  * 判断ua是否与正则匹配
  * @param {String|RegExp} regex 正则字符串|正则对象
  * @returns {boolean}
  */
 const isMatch = (str: string) => {
   // 正则合法性校验
   if (!str) {
     throw new Error('regex参数必须有值');
   }
   const regex = new RegExp(str);
   // 返回匹配结果
   return regex.test(navigator.userAgent);
 }

  /**
 * 依次匹配数组每一项，某一项匹配成功则全部成功
 * @param {(String[]|RegExp[])} array 正则数组
 * @param {String} ua 用户ua
 * @returns {boolean}
 */
const isMatchInArray = (array: string[]) => {
  return array.some(item => isMatch(item));
}

/**
 * 判断是移动端
 * @param {String} ua 根据ua判断，服务端时一定要传，客户端时可不传默认取客户端ua
 * @returns {Boolean}
 */
export const isMobile = () => {
  return isMatchInArray(['Mobile']);
}
