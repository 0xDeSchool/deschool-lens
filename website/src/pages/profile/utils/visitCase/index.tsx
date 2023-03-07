import { getUserManager, useAccount } from '~/account'

export type VisitType = 0 | 1 | -1

/**
 * @description 初始化登录场景，区分自己访问自己或自己访问别人或者别人访问
 * @param routeAddress string | undefined | null
 * @return primaryCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人 -1-没登录访问自己
 */
export function getVisitCase(routeAddress: string | undefined | null): VisitType {
  const address = getUserManager().user?.address
  let visitCase: VisitType = -1
  // 地址栏和缓存都没有地址，既不是访问他人空间也不是访问自己，需要登录访问自己
  if (!address) {
    visitCase = -1
    return visitCase
  }
  // 有路由参数并且等于自己地址，即访问自己空间
  if (!routeAddress || (routeAddress && address === routeAddress)) {
    visitCase = 0
    return visitCase
  }
  // 有路由参数并且不等于自己地址，即访问他人的空间（不管是否登录都可以看他人空间）
  if (routeAddress && address !== routeAddress) {
    visitCase = 1
    return visitCase
  }
  return visitCase
}
