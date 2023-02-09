import http from '~/api/http'
import type { Profile } from './lens/graphql/generated'

/**
 * @method getUserProfile
 * @description 从后台获取用户信息
 * @returns {Object} Promise
 */
export async function getUserProfile(userId?: string): Promise<Profile | null> {
  try {
    const result: any = userId ? await http.get(`/account/my-profile?userId=${userId}`) : await http.get(`/account/my-profile`)
    return result
  } catch (err) {
    // token 过期
    // if (result.code === 100243) {
    return null
    // }
  }
}
/**
 * @method getUserSBTs
 * @description 获取用户的钱包地址对应的sbts
 * @param {Object}
 * @returns {Object}  Promise
 */
export async function getUserSBTs(address?: string) {
  return address ? http.get(`/account/my-sbt?addr=${address}`) : http.get(`/account/my-sbt`)
}

/**
 * @method getUserNfts
 * @description 获取用户的钱包地址对应的nfts
 */
export async function getUserNfts(cursor: string, limit: number) {
  return http.get(`/account/my-nft?cursor=${cursor}&limit=${limit}`)
}
