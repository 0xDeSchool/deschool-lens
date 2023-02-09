/**
 * 权限 高阶组件
 * @param {reactNode} ComposedComponent 需要权限控制的组件
 * @param {string} path 页面pathname
 * @param {string} webKey 操作web key
 */

import type { FC } from 'react'
import { checkAuth } from '~/hooks/access'

type WrapAuthProps = {
  children: any // 内嵌组件
  defaultNode?: React.ReactNode // 默认显示组件，当没有权限时显示
}

// 鉴权高阶组件
const WrapAuth: FC<WrapAuthProps> = props => {
  const { children, defaultNode } = props

  // 自定义渲染
  if (typeof children === 'function') {
    return children(checkAuth())
  }

  return checkAuth() ? children : defaultNode || null
}

export default WrapAuth
