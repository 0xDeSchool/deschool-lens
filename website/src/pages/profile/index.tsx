/**
 * @description 用户个人中心Page，包括个人空间和他人空间
 * @author victor
 * @exports {UserProfile}
 */
import { Outlet, useParams } from 'react-router'
import UserCard from './userCard'
import BusinessUserCard from './resume/components/businessCard/index'
import Footer from '~/layout/footer/index.mobile'

const UserProfile = () => {
  const { address, userId } = useParams()

  return (
    <div className="frc-between flex-wrap relative w-auto lg:mx-10 md:py-10 3xl:w-full 3xl:mx-auto 3xl:max-w-1440px 4xl:max-w-1680px h-full overflow-auto scroll-hidden">
      <div className="w-full xl:w-400px xl:mt-0 self-start bg-#FFFFFF">
        {/* 用戶面板信息從路由來或者自己緩存來 */}
        {!userId && <UserCard routeAddress={address} />}
        {userId && <BusinessUserCard />}
        {/* {location.pathname.includes('/profile/resume') && !address|| user?.address && user.address == address ?  <Verified/> : null} */}
      </div>
      <div className="w-full xl:w-auto xl:ml-3 flex-1 relative font-ArchivoNarrow overflow-auto">
        <div className="mb-10 overflow-auto md:p-6 md:border md:shadow-md md:rounded-xl">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default UserProfile
