interface TokenInfo {
  address: string
  lens: {
    accessToken: string | null
    refreshToken: string | null
  }
  deschool: {
    token: string | null
  }
}

// type LoginResult = {
//     success: boolean
//     error?: string
//     result?: LoginUserInfo
// }

// type LoginUserInfo = {
//     jwtToken: string
//     userId: string,
//     username: string,
//     avatar: string,
//     address: string
// }

// function loginError(msg: string): LoginResult {
//     return {
//         success: false,
//         error: msg,
//     }
// }

const curToken: TokenInfo = {
  address: '',
  lens: {
    accessToken: null,
    refreshToken: null,
  },
  deschool: {
    token: null,
  },
}

export function getToken(): TokenInfo | null {
  if (curToken == null) {
    return null
  }
  return { ...curToken }
}

function getKey(address: string) {
  return `token:${address}`.toLowerCase()
}

export function isLogin(): boolean {
  return !!getToken()?.lens.accessToken
}

export function getCachedToken(address: string): string | null {
  return localStorage.getItem(getKey(address))
}

function setCachedToken(address: string, token: string | null) {
  if (token == null) {
    localStorage.removeItem(getKey(address))
  } else {
    localStorage.setItem(getKey(address), token)
  }
}

export function setToken(address: string, accessToken: string | null, refreshToken: string | null, deschoolToken?: string | null) {
  curToken.address = address
  curToken.lens.accessToken = accessToken
  curToken.lens.refreshToken = refreshToken
  // 不一定存在，单独存储
  if (deschoolToken) {
    curToken.deschool.token = deschoolToken
    setCachedToken(`deschool_${address}`, JSON.stringify(curToken.deschool))
  }
  setCachedToken(address, JSON.stringify(curToken.lens))
}

export function removeToken() {
  setCachedToken(curToken.address, null)
  setCachedToken(`deschool_${curToken.address}`, null)
}

export const getAddress = () => (!curToken.address ? null : curToken.address)
