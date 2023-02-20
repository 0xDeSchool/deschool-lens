import { useEffect, useState } from 'react'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
// import { useTranslation } from 'react-i18next'
import Jazzicon from 'react-jazzicon'
import Button from 'antd/es/button'
import { getRecommendation, getVerifiedIdentities, PlatformType } from '~/api/booth/booth'
import { getUserContext } from '~/context/account'
import { getShortAddress } from '~/utils/format'
import type { ProfileExtend, RecommendAddr } from '~/lib/types/app'
import { unfollowByProfileIdWithLens } from '~/api/lens/follow/unfollow'
import { checkfollowUser, followUser, unfollowUser } from '~/api/booth/follow'
import { fetchUserDefaultProfile } from '~/hooks/profile'
import { doesFollow } from '~/api/lens/follow/doesFollow'
import { followByProfileIdWithLens } from '~/api/lens/follow/follow'

const BOOTH_PATH = import.meta.env.VITE_APP_BOOTH_PATH
// 根据match config配置的参数推荐用户想找的人
const Suggest = (props: { open: boolean }) => {
  // const { t } = useTranslation()
  const { open } = props
  const [loading, setLoading] = useState(false)
  const [suggestedUser, setSuggestedUser] = useState({} as RecommendAddr)
  const [suHasDesc, setSuHasDesc] = useState(false)
  const [suHasLens, setSuHasLens] = useState(false)
  // visitor has followed suggested user on DeSchool
  const [vfsd, setVfsd] = useState(false)
  // visitor has followed suggested user on Lens
  const [vfsl, setVfsl] = useState(false)
  const [suLensProfile, setSuLensProfile] = useState<ProfileExtend>()

  const { lensToken, deschoolProfile } = getUserContext()

  // Lens Follow
  const handleFollowLens = async (fu: ProfileExtend | undefined | null) => {
    const tx = await followByProfileIdWithLens(fu?.id)
    message.success(`success following ${fu?.handle},tx is ${tx}`)
    setVfsl(true)
  }

  // Lens Unfollow
  const handleUnFollowLens = async (fu: ProfileExtend | undefined | null) => {
    const tx = await unfollowByProfileIdWithLens(fu?.id)
    message.success(`success unfollowing ${fu?.handle},tx is ${tx}`)
    setVfsl(false)
  }

  // DeSchool Follow
  const handleFollowDesc = async (address: string) => {
    await followUser(address, deschoolProfile?.address!)
    message.success(`success following ${address}`)
    setVfsd(true)
  }

  // DeSchool Unfollow
  const handleUnfollowDesc = async (address: string) => {
    await unfollowUser(address, deschoolProfile?.address!)
    message.success(`success unfollowing ${address}`)
    setVfsd(false)
  }

  // 初始化推荐用户
  const initSuggestedUsers = async () => {
    setLoading(true)
    try {
      // 选择当前登陆账号
      let address = getUserContext().lensToken?.address
      if (!address) {
        const dscAddr = getUserContext().deschoolProfile?.address
        if (!dscAddr) {
          return
        }
        address = dscAddr
      }

      // 获得推荐人
      const result = await getRecommendation(address)
      if (!result) {
        return
      }
      setSuggestedUser(result)

      // 获取两人地址
      const userAddr = lensToken?.address || deschoolProfile?.address
      if (!userAddr) {
        return
      }

      const suAddr = result.ToAddr
      // 获得推荐人的 Verified ID
      const res = await getVerifiedIdentities(suAddr)
      let suDesc = false
      let suLens = false
      let suAddrLens = ''
      if (res) {
        res.forEach(element => {
          if (element.platform === PlatformType.DESCHOOL) {
            setSuHasDesc(true)
            suDesc = true
          }
          if (element.platform === PlatformType.LENS) {
            setSuHasLens(true)
            suLens = true
            suAddrLens = element.address
          }
        })
      }

      // 如果两人有 DeSchool ID
      if (suDesc && deschoolProfile?.address) {
        // To Addr 1 param, From Addr 2 param
        const dscFollowed = await checkfollowUser(suAddr, userAddr)
        if (dscFollowed?.fromFollowedTo) {
          setVfsd(true)
        }
      }

      // 如果两人有 Lens ID
      if (suLens && lensToken?.address) {
        // 获取 SU Lens 数据
        const usInfo = await fetchUserDefaultProfile(suAddrLens) // 此case下必不为空
        // 此人没有handle，lens没数据
        if (!usInfo) {
          return
        }
        // 此人有数据 查询follow关系 设置一下
        const suUserInfo = await fetchUserDefaultProfile(suAddr)
        setSuLensProfile(suUserInfo)
        const uFs = await doesFollow(userAddr, suUserInfo?.id)
        if (uFs) {
          setVfsl(uFs[0].follows)
        }
      }
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initSuggestedUsers()
  }, [open])

  return (
    <div className="w-full fcs-center border shadow-md rounded-xl mt-4">
      {loading && (
        <div className="w-full h-200px fcc-center p-4">
          <Skeleton />
        </div>
      )}
      {!loading && suggestedUser && suggestedUser.ToAddr ? (
        <div className="border rounded-xl w-full  p-4">
          {/* 头像 + 推荐分数 */}
          <div className="flex flex-row justify-between">
            <div className="px-4 mr-2">
              {/* <LensAvatar avatarUrl={suggestedUser?.avatarUrl} size={60} wrapperClassName="fcc-center w-full" /> */}
              <Jazzicon diameter={70} seed={Number(suggestedUser?.ToAddr)} />
            </div>

            <div className="flex flex-col justify-between items-center h-full">
              <div className="flex flex-col items-center">
                <div>RECOMMENDED SCORE</div>
                <div className="text-4xl my-2">{suggestedUser.Score}</div>
              </div>
            </div>
          </div>
          {/* 推荐原因 */}
          <div className="flex fcs-center ml-">
            <h1 className="mb-2 font-bold text-lg">{getShortAddress(suggestedUser?.ToAddr)}</h1>
            <h2 className="mb-1">He/She is recommended because</h2>
            <ul>
              {suggestedUser.Reasons &&
                suggestedUser.Reasons.map(item => (
                  <li key={item} className="ml-2 my-1">
                    * {item}
                  </li>
                ))}
            </ul>
          </div>
          {/* 最下面的操作按钮 */}
          <div className="flex flex-row justify-between">
            <Button type="primary" href={`${BOOTH_PATH}/profile/${suggestedUser.ToAddr}/resume`}>
              Visit Booth
            </Button>
            <div>
              <Button disabled className="">
                Chat
              </Button>
              {/* DeSchool Follow */}
              {suHasDesc && deschoolProfile?.address && (
                <Button
                  className="ml-2"
                  onClick={() => (vfsd ? handleUnfollowDesc(suggestedUser.ToAddr) : handleFollowDesc(suggestedUser.ToAddr))}
                >{`${vfsd ? 'Unfollow' : 'Follow'} on DeSchool`}</Button>
              )}

              {/* Lens Follow */}
              {suHasLens && lensToken?.address && (
                <Button className="ml-2" onClick={() => (vfsd ? handleUnFollowLens(suLensProfile) : handleFollowLens(suLensProfile))}>
                  {`${vfsl ? 'Unfollow' : 'Follow'} on Lens`}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="w-full h-200px fcc-center">
            <div className="text-xl font-bold">Recommendation Requires a Form Filled by You</div>
            <div className="mt-4">You haven't fill the preference form in the right of this page yet. </div>
          </div>
        )
      )}
    </div>
  )
}
export default Suggest
