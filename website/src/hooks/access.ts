import { RoleType } from '~/lib/enum'

let accessMap: { [x: string]: any; roles?: RoleType[] } = {}

const setAccess = (value: { [x: string]: any }) => {
  Object.assign(accessMap, value)
}

const uploadScopes = async (handle?: string) => {
  setAccess({ 'RoleType.User': !!handle })
}

const initAccess = async (role?: RoleType) => {
  setAccess({ roles: [role || RoleType.Visiter] })
}

// 验证传进来的组件该用户是否有权限, 返回true或者false
const checkAuth = () => {
  if (accessMap?.roles?.includes(RoleType.User)) {
    return true
  }
  return false
}

const getRole = () => {
  if (accessMap?.roles?.includes(RoleType.User)) return RoleType.User
  if (accessMap?.roles?.includes(RoleType.UserWithoutHandle)) return RoleType.UserWithoutHandle
  return RoleType.Visiter
}

const resetAccess = () => {
  accessMap = {}
}

export { initAccess, checkAuth, uploadScopes, resetAccess, getRole }
