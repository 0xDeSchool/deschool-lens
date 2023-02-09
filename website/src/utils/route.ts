import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
/**
 * @description 路由跳转
 * @param {}
 * @returns {}
 */
const routeJump = (route: string, e?: React.MouseEvent<HTMLElement> | undefined, outside?: boolean) => {
  if (e) {
    e.preventDefault()
  }
  if (outside) {
    window.open(route)
  } else {
    // history.push(route, state?)
    history.push(route)
    history.go(0)
  }
}

/**
 * @description 回退到上一个路由页面
 * @param {Event} e
 * @returns {}
 */
const routeBack = (e: React.MouseEvent<HTMLElement> | undefined) => {
  if (e) {
    e.preventDefault()
  }
  if (window.location.pathname === '/404') {
    routeJump('/landing')
  } else {
    history.back()
  }
}

export { history, routeJump, routeBack }
