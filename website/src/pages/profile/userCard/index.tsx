/**
 * @description 用户相关信息的展示
 * @author victor
 * @exports {UserInfo}
 * @props
 */
import { useState } from 'react'
import DeschoolCard from './deschoolCard'
import LensCard from './lensCard'

type UserCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

const UserCard = (props: UserCardProps) => {
  const { visitCase, routeAddress } = props
  const [profileType, setProfileType] = useState('lens')

  return (
    <div>
      <LensCard
        visitCase={visitCase}
        routeAddress={routeAddress}
        visible={profileType === 'lens'}
        setProfileType={setProfileType}
        profileType={profileType}
      />
      <DeschoolCard
        visitCase={visitCase}
        routeAddress={routeAddress}
        visible={profileType === 'deschool'}
        setProfileType={setProfileType}
        profileType={profileType}
      />
    </div>
  )
}

export default UserCard
