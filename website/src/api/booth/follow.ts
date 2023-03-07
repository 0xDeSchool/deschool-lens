import http from '~/api/booth/http'

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
 * @param visitorAddress string 如果传了值，就需要查followings与这个人的follow关系
 * @returns
 */
export async function getFollowings(userId: string, visitorUserId?: string): Promise<any> {
  try {
    const str = visitorUserId ? `/follow/following?userId=${userId}&visitorUserId=${visitorUserId}` : `/follow/following?userId=${userId}`
    const result = await http.get(str)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * @description 根据地址查询deschool的此地址下的Followers
 * @param address string
 * @param visitorAddress string 如果传了值，就需要查followers与这个人的follow关系
 * @returns
 */
export async function getFollowers(userId: string, visitorUserId?: string): Promise<any> {
  try {
    const str = visitorUserId ? `/follow/follower?userId=${userId}&visitorUserId=${visitorUserId}` : `/follow/follower?userId=${userId}`
    const result = await http.get(str)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}
