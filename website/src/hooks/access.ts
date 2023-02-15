import { RoleType } from '~/lib/enum'

let currentRole: RoleType = RoleType.Visiter
// let accessMap: { [x: string]: any; roles?: RoleType[] } = {}

// const setAccess = (value: { [x: string]: any }) => {
//   Object.assign(accessMap, value)
// }

// const uploadScopes = async (handle?: string) => {
//   setAccess({ 'RoleType.User': !!handle })
// }

export const initAccess = async (_role?: RoleType) => {
  if (_role) {
    currentRole = _role
  } else {
    currentRole = RoleType.Visiter
  }
}

// 验证传进来的组件该用户是否有权限, 返回true或者false
export const checkAuth = () => currentRole === RoleType.User

export const getRole = () => currentRole

// const resetAccess = () => {
//   accessMap = {}
// }
