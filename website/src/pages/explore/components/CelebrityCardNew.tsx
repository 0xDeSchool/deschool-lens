import { useState } from 'react'
import type { NewUserInfo } from '~/api/booth/types'
import { PlatformType } from '~/api/booth/booth'
import PlatformBoard from '~/components/platformBoard'
import UserInfoDeschool from './UserInfoDeschool'
import UserInfoCyberConnect from './UserInfoCyberConnect'
import UserInfoLens from './UserInfoLens'

type CelebrityCardNewProps = {
  userInfo: NewUserInfo
}

const CelebrityCardNew: React.FC<CelebrityCardNewProps> = (props) => {
  const { userInfo } = props
  const [active, setActive] = useState<PlatformType>(PlatformType.DESCHOOL)

  return (
    <div className="fcs-center px-6 py-8 rounded-md shadow-md w-375px bg-gradient-to-b from-#FFFFFF to-#e3eeff">
      {/* header */}
      <PlatformBoard defaultActive={active} change={setActive}/>
      {/* user info */}
      {active === PlatformType.LENS && (<UserInfoLens {...userInfo} />)}
      {active === PlatformType.CYBERCONNECT && (<UserInfoCyberConnect {...userInfo}/>)}
      {active === PlatformType.DESCHOOL && (<UserInfoDeschool {...userInfo} />)}
    </div>
  )
}

export default CelebrityCardNew
