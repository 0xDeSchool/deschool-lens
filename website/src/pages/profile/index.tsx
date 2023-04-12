/**
 * @description 用户个人中心Page，包括个人空间和他人空间
 * @author victor
 * @exports {UserProfile}
 */
import { Outlet, useParams } from 'react-router'
import Footer from '~/layout/footer/index.mobile'
import { isMobile } from '~/utils/ua'
import { ProfileContextProvider } from '~/context/profile'
import { useState } from 'react'
import UserCard from './userCard'
import BusinessUserCard from './resume/components/businessCard/index'
import RegisterCard from './resume/components/registerCard'

const UserProfile = () => {
  const { address } = useParams()
  const mobile = isMobile()
  const kcAddressPrd = '0x9672c0e1639f159334ca1288d4a24deb02117291'
  const kcAddressStg = '0x726587f4f5c8643e0a49a142a758cea55598ae9c'
  const rebeccaPrd = '0x13e283646f203ef6b24cd5c8ed5dbbf29dd0d39f'
  const addressList = [kcAddressPrd, kcAddressStg, rebeccaPrd]
  const isKCorRebecca = !address ? false : addressList.includes(address?.toLowerCase())
  const [registerCardVisible, setRegisterCardVisible] = useState(isKCorRebecca)

  let who
  if (!address) {
    who = null
  } else {
    // eslint-disable-next-line no-nested-ternary
    who = [kcAddressPrd, kcAddressStg].includes(address?.toLowerCase()) ? 'kc' : rebeccaPrd === address?.toLowerCase() ? 'r' : null
  }
  
  return (
    <ProfileContextProvider>
      <div className="frc-between flex-wrap relative w-auto lg:mx-10 md:py-10 3xl:w-full 3xl:mx-auto 3xl:max-w-1440px 4xl:max-w-1680px h-full overflow-auto scroll-hidden">
        <div className="w-full xl:w-400px xl:mt-0 self-start bg-#FFFFFF">
          {/* 用戶面板信息從路由來或者自己緩存來 */}
          {!mobile && <UserCard routeAddress={address} />}
          {mobile && <BusinessUserCard />}
          {mobile && <RegisterCard registerCardVisible={registerCardVisible} setRegisterCardVisible={setRegisterCardVisible} who={who} />}
          {/* {location.pathname.includes('/profile/resume') && !address|| user?.address && user.address == address ?  <Verified/> : null} */}
        </div>
        <div className="self-start w-full xl:w-auto xl:ml-3 flex-1 relative font-ArchivoNarrow md:overflow-auto">
          <div className="mb-10 overflow-auto md:p-6 md:border md:shadow-md md:rounded-xl">
            <Outlet />
          </div>
          {mobile && <Footer />}
        </div>
      </div>
    </ProfileContextProvider>
  )
}

export default UserProfile
