import { isMobile as mobile } from 'react-device-detect'
/**
 * 判断是移动端
 * @param {String} ua 根据ua判断，服务端时一定要传，客户端时可不传默认取客户端ua
 * @returns {Boolean}
 */
export const isMobile = () => mobile
