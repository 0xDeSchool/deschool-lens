import http from '~/api/booth/http'

/**
 * @description deschool follow user
 * @param toAddr string
 * @param fromAddr string
 * @returns
 */
export async function followUser(toAddr: string, fromAddr: string): Promise<any> {
  try {
    const result = await http.post(`/follow`, { toAddr, fromAddr })
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
export async function unfollowUser(toAddr: string, fromAddr: string): Promise<any> {
  try {
    const result = await http.post(`/unfollow`, { toAddr, fromAddr })
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * @description deschool check follow or not
 * @param toAddr string
 * @param fromAddr string
 * @returns
 */
export async function checkfollowUser(toAddr: string, fromAddr: string): Promise<any> {
  try {
    const result = await http.post(`/follow?toAddr=${toAddr}&fromAddr=${fromAddr}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * @description 根据地址查询deschool的此地址下的Followings
 * @param address string
 * @param visitorAddress string 如果传了值，就需要查followings与这个人的follow关系
 * @returns
 */
export async function getFollowings(address: string, visitorAddress?: string): Promise<any> {
  try {
    const result = await http.post(`/follow/following?addr=${address}&visitorAddress=${visitorAddress}`)
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
export async function getFollowers(address: string, visitorAddress?: string): Promise<any> {
  try {
    const result = await http.post(`/follow/follower?addr=${address}&visitorAddress=${visitorAddress}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}
