/**
 * 权限 高阶组件
 * @param {reactNode} ComposedComponent 需要权限控制的组件
//  * @param {string} path 页面pathname
 * @param {string} webKey 操作web key
 */
import type { FC } from 'react'
import { checkAuth } from '~/hooks/access'
import NoAuth from '~/pages/noAuth'

type WrapAuthPageProps = {
  children: any // 内嵌组件
}

// 鉴权高阶组件
const WrapAuthPage: FC<WrapAuthPageProps> = props => {
  const { children } = props
  if (!checkAuth()) {
    // 是否自动跳转
    // const timeoutId = setTimeout(() => {
    //   navigate('/notauth', { replace: true })
    //   clearTimeout(timeoutId)
    // }, 300)
    return <NoAuth />
  }

  return children
}

export default WrapAuthPage
