interface TokenInfo {
  addr: string
  token: string | null
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

const curToken: TokenInfo = { addr: '', token: null }

export function getToken(): TokenInfo | null {
  if (curToken == null) {
    return null
  }
  return { ...curToken }
}

function getKey(addr: string) {
  return `token:${addr}`.toLowerCase()
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
// async function loginByAddr(addr: string): Promise<LoginResult> {
//     const isMainChain = checkIsExpectChain()
//     if (!isMainChain) {
//         return loginError("current chain is not right")
//     }
//     const provider = checkProvider()
//     if (!provider) {
//         return loginError("has no provider")
//     }
//     // 走服务拿nonce
//     const nonceRes: any = await getNonceByUserAddress({ address: addr })
//     if (!nonceRes.success) {
//         return loginError("request login nounce is error")
//     }
//     const { nonce } = nonceRes
//     // 用nonce做签名
//     const signer = provider.getSigner()
//     const FIX_FORMAT_MESSAGE = `DeSchool is kindly requesting to Sign in with MetaMask securely, with nonce: ${nonce}. Sign and login now, begin your journey to DeSchool!`
//     const loginSig = await signer.signMessage(FIX_FORMAT_MESSAGE)
//     // 将签名存后台
//     const loginResult: any = await postNonceSigByUserAddress({
//         address: addr,
//         sig: loginSig,
//     })
//     return {
//         success: true,
//         result: loginResult,
//     }
// }
