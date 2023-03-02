/**
 * @description 用户个人中心Page，包括个人空间和他人空间
 * @author victor
 * @exports {UserProfile}
 */
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { useAccount } from '~/context/account'
import UserCard from './userCard'
import Verified from './resume/components/verified'
import {getVisitCase, VisitType} from './utils/visitCase'
import message from 'antd/es/message'

const UserProfile = () => {
  const { address } = useParams()
  const navigate = useNavigate()
  const { lensToken, cyberToken, deschoolProfile } = useAccount()
  const location = useLocation()

  const [visitCase, setVisitCase] = useState<VisitType>(-1) // 0-自己访问自己 1-自己访问别人 -1-没登录访问自己

  // 初始化登录场景，区分自己访问自己或自己访问别人或者别人访问
  const initCase = () => {
    const primaryCase = getVisitCase(address)
    setVisitCase(primaryCase)
    if (primaryCase === -1) {
      message.warning('please login first')
      return
    }
    if (primaryCase === 0) {
      navigate('/profile/resume')
      return
    }
    navigate(`/profile/${address}/resume`)
  }

  useEffect(() => {
    initCase()
  }, [address, deschoolProfile, lensToken, cyberToken])

  return (
    <div className="relative w-auto mx-10 py-10 3xl:w-full 3xl:mx-auto 3xl:max-w-1440px 4xl:max-w-1680px fcc-center xl:frs-center h-full overflow-auto scroll-hidden">
      <div className="w-full mt-70 xl:w-400px xl:mt-0">
        {/* 用戶面板信息從路由來或者自己緩存來 */}
        <UserCard visitCase={visitCase} routeAddress={address} />
        {location.pathname.includes('/profile/resume') ? <Verified /> : null}
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
