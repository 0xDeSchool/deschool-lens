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

// key: address | deschool_address
export function getCachedToken(key: string): string | null {
  return localStorage.getItem(getKey(key))
}

function setCachedToken(address: string, token: string | null) {
  if (token == null) {
    localStorage.removeItem(getKey(address))
  } else {
    localStorage.setItem(getKey(address), token)
  }
}

export function setLensToken(address: string, accessToken: string | null, refreshToken: string | null) {
  curToken.address = address
  if (accessToken && refreshToken) {
    curToken.lens.accessToken = accessToken
    curToken.lens.refreshToken = refreshToken
    setCachedToken(address, JSON.stringify(curToken.lens))
  } else {
    console.log('setLensToken 参数缺失')
  }
}

export function setDeschoolToken(address: string, token?: string | null) {
  curToken.address = address
  if (token) {
    curToken.deschool.token = token
    setCachedToken(`deschool_${address}`, JSON.stringify(curToken.deschool))
  } else {
    console.log('setDeschoolToken 参数缺失')
  }
}

export function removeToken() {
  setCachedToken(curToken.address, null)
  setCachedToken(`deschool_${curToken.address}`, null)
}

export const getAddress = () => (!curToken.address ? null : curToken.address)
