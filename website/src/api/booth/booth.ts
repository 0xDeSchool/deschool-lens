import http from '~/api/booth/http'

export enum PlatformType {
  BOOTH = 0,
  DESCHOOL = 1,
}

export interface VerifiedInfo {
  address: string
  lensHandle?: string
  baseAddress: string
  platform: PlatformType
}

/**
 * @method postVerifiedIdentity
 * @description 登录成功后提交验证绑定信息
 * @returns {Object} Promise
 */
export async function postVerifiedIdentity(params: VerifiedInfo): Promise<{ success: boolean }> {
  try {
    const result: { success: boolean } = await http.post(`/id/validate`, params)
    return result
  } catch (err) {
    console.log(err)
    return { success: false }
  }
}

export interface Identity {
  address: string
  platform: string
}

/**
 * @method getVerifiedIdentities
 * @description 获取当前登录的booth账号绑定的其余identities, 用于verifiedId页面数据获取
 * @returns {Object} Promise
 */
export async function getVerifiedIdentities(address: string): Promise<Identity[]> {
  try {
    const result: Identity[] = await http.get(`/id/list?address=${address}`)
    return result
  } catch (err) {
    console.log(err)
    return []
  }
}

export interface Resume {
  address: string
  data: string
}
/**
 * @method getResume
 * @description 获取当前 address 用户的简历信息
 * @returns {Object} Promise
 */
export async function getResume(address: string): Promise<Resume | undefined> {
  try {
    const result: Resume = await http.get(`/resume?address=${address}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export interface ResumeParam {
  address: string
  data: string
}

export async function putResume(param: ResumeParam): Promise<Resume | undefined> {
  try {
    const result: Resume = await http.put(`/resume`, param)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export interface SbtDetail {
  token_address: string
  token_id: string
  token_uri: string
  normalized_metadata: {
    name: string
    description: string
    image: string
  }
}
export interface AbilitySbt {
  ability: number[]
  sbts: SbtDetail[]
}
export async function getIdSbt(address: string): Promise<AbilitySbt | undefined> {
  try {
    const result: AbilitySbt = await http.get(`/id/sbt?address=${address}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}
