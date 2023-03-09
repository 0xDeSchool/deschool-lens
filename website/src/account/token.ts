export interface TokenInfo {
  addr: string
  token: string | null
}

const curToken: TokenInfo = { addr: '', token: null }

export function getToken(): TokenInfo | null {
  if (curToken == null) {
    return null
  }
  return { ...curToken }
}

function getKey(addr: string) {
  return `booth-token:${addr}`.toLowerCase()
}

export function isLogin(): boolean {
  return !!getToken()?.token
}

export function getCachedToken(addr: string): string | null {
  return localStorage.getItem(getKey(addr))
}

function setCachedToken(addr: string, token: string | null) {
  if (token == null) {
    localStorage.removeItem(getKey(addr))
  } else {
    localStorage.setItem(getKey(addr), token)
  }
}

export function setToken(addr: string, token: string | null) {
  curToken.addr = addr
  curToken.token = token
  setCachedToken(addr, token)
}

export function removeToken() {
  setCachedToken(curToken.addr, null)
}