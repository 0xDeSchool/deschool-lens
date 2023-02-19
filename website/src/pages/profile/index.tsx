/**
 * @description 用户个人中心Page，包括个人空间和他人空间
 * @author victor
 * @exports {UserProfile}
 */
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { useAccount } from '~/context/account'
import message from 'antd/es/message'
import Suggest from '~/pages/profile/suggested'
import UserCard from './userCard'
import Verified from './resume/components/verified'

const UserProfile = () => {
  const { address } = useParams()
  const navigate = useNavigate()
  const { lensToken, deschoolToken } = useAccount()
  const location = useLocation()

  const [visitCase, setVisitCase] = useState<0 | 1 | -1>(-1) // 0-自己访问自己 1-自己访问别人 -1-没登录访问自己

  // 初始化登录场景
  const initCase = () => {
    let primaryCase: 0 | 1 | -1 = -1
    const cacheLensAddress = lensToken?.address
    const cacheDeschoolAddress = deschoolToken?.address

    if (address) {
      // 有路由参数并且不等于自己地址，即访问他人的空间（不管是否登录都可以看他人空间）
      if (address !== cacheLensAddress && address !== cacheDeschoolAddress) primaryCase = 1
      // 有路由参数并且等于自己lens或者deschool地址，即访问自己空间
      else if (address === cacheLensAddress || address === cacheDeschoolAddress) {
        primaryCase = 0
      }
    }
    // 没有路由参数并且有缓存自己地址, 访问自己空间
    else if (cacheLensAddress || cacheDeschoolAddress) {
      primaryCase = 0
    }
    // 地址栏和缓存都没有地址，既不是访问他人空间也不是访问自己，需要登录访问自己
    else {
      primaryCase = -1
      message.warning('please login first')
    }
    setVisitCase(primaryCase)
    return primaryCase
  }

  // 初始化右侧的路由和内容
  const initRoute = () => {
    // 路由存在这个参数，需要判断导向
    if (address) {
      // 自己看自己
      if (address === lensToken?.address || address === deschoolToken?.address) {
        navigate('/profile/resume')
      }
      // 自己看别人
      else {
        navigate(`/profile/${address}/resume`)
      }
    }
    // 路由不存在参数，由router判断导向
  }

  useEffect(() => {
    initCase()
  }, [])

  useEffect(() => {
    initRoute()
  }, [address])

  return (
    <div className="relative w-auto mx-10 py-10 3xl:w-full 3xl:mx-auto 3xl:max-w-1440px 4xl:max-w-1680px fcc-center xl:frs-center h-full overflow-auto scroll-hidden">
      <div className="w-full mt-70 xl:w-400px xl:mt-0">
        {/* 用戶面板信息從路由來或者自己緩存來 */}
        <UserCard visitCase={visitCase} address={address} />
        {location.pathname.includes('/profile/resume') ? <Verified /> : null}
        {location.pathname.includes('/profile/match') ? <Suggest /> : null}
      </div>
      <div className="w-full xl:w-auto xl:ml-3 flex-1 relative font-ArchivoNarrow">
        <div className="mb-10 overflow-auto p-6 border shadow-md rounded-xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserProfile
