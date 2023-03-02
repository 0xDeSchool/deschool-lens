/**
 * @description 用户相关信息的展示
 * @author victor
 * @exports {UserInfo}
 * @props
 */
import { useEffect, useState } from 'react'
import { useAccount } from '~/context/account'
import DeschoolCard from './deschoolCard'
import LensCard from './lensCard'
import CyberConnectCard from './cyberConnectCard'
import { VisitType } from '../utils/visitCase'

type UserCardProps = {
  visitCase: VisitType
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

const UserCard = (props: UserCardProps) => {
  const { visitCase, routeAddress } = props
  const { lensProfile, cyberProfile, deschoolProfile } = useAccount()
  const [profileType, setProfileType] = useState('cyber') // lens, deschool, cyber

  useEffect(() => {
    if (!cyberProfile) {
      if (deschoolProfile) {
        setProfileType('deschool')
      }
    } else {
      setProfileType('cyber')
    }
  }, [cyberProfile])

  useEffect(() => {
    if (!deschoolProfile) {
      if (lensProfile) {
        setProfileType('lens')
      }
    } else {
      setProfileType('deschool')
    }
  }, [deschoolProfile])

  return (
    <div>
      <LensCard
        visitCase={visitCase}
        routeAddress={routeAddress}
        visible={profileType === 'lens'}
        setProfileType={setProfileType}
        profileType={profileType}
      />
      <CyberConnectCard
        visitCase={visitCase}
        routeAddress={routeAddress}
        visible={profileType === 'cyber'}
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
