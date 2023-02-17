import http from '~/api/booth/http'
import type { RecommendAddr } from '~/lib/types/app'

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
  platform: PlatformType
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
/**
 * @description 根据用户地址获取他链接过的所有sbt的详情
 * @param address
 * @returns {AbilitySbt}
 */
export async function getIdSbt(address: string): Promise<AbilitySbt | undefined> {
  try {
    const result: AbilitySbt = await http.get(`/id/sbt?address=${address}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export interface q11eParam {
  address: string
  goals: string[]
  interests: string[]
  pref1: string
  pref2: string
  pref3: string
  mbti: number
}

export async function putQ11e(param: q11eParam): Promise<string | undefined> {
  try {
    const result: string = await http.put(`/q11e`, param)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export async function getRecommendation(address: string): Promise<RecommendAddr | undefined> {
  try {
    const result: RecommendAddr = await http.get(`/id/recommendation?address=${address}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export interface q11eModel {
  address: string
  goals: string[]
  interests: string[]
  pref1: string
  pref2: string
  pref3: string
  mbti: number
}

export async function getQ11e(address: string) {
  try {
    const result: q11eModel = await http.get(`/q11e?address=${address}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export interface SBTMeta {
  description: string
  image: string
  name: string
  contractType: string
  contractAddr: string
  tokenId: string
}
export interface SBTDetailResult {
  Metadata: SBTMeta | null | undefined
  Owners: string[] | null | undefined
}
/**
 * @description 获取一个指定合约地址和tokenId的SBT的详情
 * @param address string
 * @param tokenId string
 * @returns
 */
export async function getSbtDetail(address: string, tokenId: string): Promise<SBTDetailResult | undefined> {
  try {
    const result: SBTDetailResult | undefined = await http.get(`/sbt?address=${address}&tokenId=${tokenId}`)
    return result
  } catch (err) {
    console.log(err)
    return undefined
  }
}
