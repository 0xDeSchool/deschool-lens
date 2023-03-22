import { createBrowserHistory } from 'history'
import { NavigateFunction } from 'react-router'

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

export const route = (route: string, navigate?: NavigateFunction, event?: any) => {
  if (navigate && event) {
    // 检测ctrl键或command键是否被按下
    if (event.ctrlKey || event.metaKey) {
      window.open(route)
    }
    navigate(route)
  }
  return route
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
