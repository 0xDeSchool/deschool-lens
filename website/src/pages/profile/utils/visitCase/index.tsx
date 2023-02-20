import message from 'antd/es/message'
import { getUserContext } from '~/context/account'

/**
 * @description 初始化登录场景，区分自己访问自己或自己访问别人或者别人访问
 * @param routeAddress string | undefined | null
 * @return primaryCase: 0 | 1 | -1
 */
function getVisitCase(routeAddress: string | undefined | null): 0 | 1 | -1 {
  let primaryCase: 0 | 1 | -1 = -1
  const cacheLensAddress = getUserContext().lensToken?.address
  const cacheDeschoolAddress = getUserContext().deschoolProfile?.address

  if (routeAddress) {
    // 有路由参数并且不等于自己地址，即访问他人的空间（不管是否登录都可以看他人空间）
    if (routeAddress !== cacheLensAddress && routeAddress !== cacheDeschoolAddress) primaryCase = 1
    // 有路由参数并且等于自己lens或者deschool地址，即访问自己空间
    else if (routeAddress === cacheLensAddress || routeAddress === cacheDeschoolAddress) {
      primaryCase = 0
    }
  }
  // 没有路由参数并且有缓存自己地址, 访问自己空间
  else if (cacheLensAddress || cacheDeschoolAddress) {
    primaryCase = 0
  }
  // 地址栏和缓存都没有地址，既不是访问他人空间也不是访问自己，需要登录访问自己
  else {
    primaryCase = -1
    message.warning('please login first')
  }
  return primaryCase
}

export default getVisitCase
