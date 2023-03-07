/**
 * @description 用户个人中心Page，包括个人空间和他人空间
 * @author victor
 * @exports {UserProfile}
 */
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import message from 'antd/es/message'
import { useAccount } from '~/account/context'
import UserCard from './userCard'
import Verified from './resume/components/verified'

const UserProfile = () => {
  const { address } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAccount()

  // 初始化登录场景，区分自己访问自己或自己访问别人或者别人访问
  const initCase = () => {
    if (!user) {
      return
    }
    if (address && user?.address && user?.address !== address) {
      navigate(`/profile/${address}/resume`)
      return
    }
    navigate('/profile/resume')
  }

  useEffect(() => {
    initCase()
  }, [address, user])

  return (
    <div className="relative w-auto mx-10 py-10 3xl:w-full 3xl:mx-auto 3xl:max-w-1440px 4xl:max-w-1680px fcc-center xl:frs-center h-full overflow-auto scroll-hidden">
      <div className="w-full mt-70 xl:w-400px xl:mt-0">
        {/* 用戶面板信息從路由來或者自己緩存來 */}
        <UserCard routeAddress={address} />
        {/* {location.pathname.includes('/profile/resume') ? <Verified /> : null} */}
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
