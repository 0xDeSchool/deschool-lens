import http from '~/api/booth/http'
import type { UserFollower, UserFollowing } from './types'

/**
 * @description deschool follow user
 * @param toUser id string
 * @param fromUser id string
 * @returns
 */
export async function followUser(toUser: string, fromUser: string): Promise<any> {
  try {
    const result = await http.post(`/follow`, { toUser, fromUser })
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * @description deschool unfollow user
 * @param toAddr string
 * @param fromAddr string
 * @returns
 */
export async function unfollowUser(toUser: string, fromUser: string): Promise<any> {
  try {
    const result = await http.delete(`/follow`, { data: { toUser, fromUser } })
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export type FollowRelationType = { ToFollowedFrom: false; fromFollowedTo: false }

/**
 * @description deschool check follow or not
 * @param toAddr string
 * @param fromAddr string
 * @returns
 */
export async function checkfollowUser(toUser: string, fromUser: string): Promise<FollowRelationType | any> {
  try {
    const result = await http.get(`/follow?toUser=${toUser}&fromUser=${fromUser}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * @description 根据地址查询deschool的此地址下的Followings
 * @param userId string
 * @returns
 */
export function getFollowings(userId: string): Promise<UserFollowing[]> {
  return http.get(`/follow/following?userId=${userId}`)
}

/**
 * @description 根据地址查询deschool的此地址下的Followers
 * @param address string
 * @returns
 */
export function getFollowers(userId: string): Promise<UserFollower[]> {
  return http.get(`/follow/follower?userId=${userId}`)
}
