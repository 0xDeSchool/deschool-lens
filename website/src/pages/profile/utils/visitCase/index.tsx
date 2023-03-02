import { getUserContext } from '~/context/account'

export type VisitType = 0 | 1 | -1

/**
 * @description 初始化登录场景，区分自己访问自己或自己访问别人或者别人访问
 * @param routeAddress string | undefined | null
 * @return primaryCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人 -1-没登录访问自己
 */
export function getVisitCase(routeAddress: string | undefined | null): VisitType {
  let visitCase: VisitType = -1
  const cacheLensAddress = getUserContext().lensToken?.address
  const cacheCyberAddress = getUserContext().cyberToken?.address
  const cacheDeschoolAddress = getUserContext().deschoolProfile?.address

  const addressList = [cacheLensAddress, cacheCyberAddress, cacheDeschoolAddress]
  if (routeAddress) {
    // If the route has address parameter and it equals to the lens or deschool address of the current user, then visit the current user's space
    // 有路由参数并且等于自己lens或者deschool地址，即访问自己空间
    if (addressList.includes(routeAddress)) {
      visitCase = 0
    }
    // If the route has address parameter and it does not equal to the current user's address, then visit another's space (you can see others' space whether you are logged in or not)
    // 有路由参数并且不等于自己地址，即访问他人的空间（不管是否登录都可以看他人空间）
    else {
      visitCase = 1
    }
  }
  // If the route does not have address parameter and the cache has the address of the current user, then visit the current user's space
  // 没有路由参数并且有缓存自己地址, 访问自己空间
  else if (addressList.some((address) => !!address)) {
    visitCase = 0
  }
  // If both the address bar and the cache do not have address, then neither visiting someone else's space nor visiting yourself, you need to log in to visit yourself
  // 地址栏和缓存都没有地址，既不是访问他人空间也不是访问自己，需要登录访问自己
  else {
    visitCase = -1
  }
  return visitCase
}
