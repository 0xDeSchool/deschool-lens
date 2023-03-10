/**
 * @description 用户相关信息的展示
 * @author victor
 * @exports {UserInfo}
 * @props
 */
import { useEffect, useState } from 'react'
import { useAccount } from '~/account'
import PlatformBoard from '~/components/platformBoard'
import { PlatformType } from '~/api/booth/booth'
import fallbackImage from '~/assets/images/fallbackImage'
import Image from 'antd/es/image'
import Jazzicon from 'react-jazzicon'
import DeschoolCard from './deschoolCard'
import LensCard from './lensCard'
import CyberConnectCard from './cyberConnectCard'
import type { VisitType } from '../utils/visitCase'

type UserCardProps = {
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

const UserCard = (props: UserCardProps) => {
  const { routeAddress } = props
  const user = useAccount()
  const [visitCase, setVisitCase] = useState<VisitType>(-1) // 0-自己访问自己 1-自己访问别人 -1-没登录访问自己
  const [profileType, setProfileType] = useState<PlatformType>(PlatformType.DESCHOOL)

  useEffect(() => {
    // 没登录访问自己
    if (user?.address) {
      setVisitCase(-1)
    }
    // 访问自己的空间
    if (!routeAddress || (routeAddress && routeAddress === user?.address)) {
      setVisitCase(0)
    }
    // 访问他人的空间
    else {
      setVisitCase(1)
    }
  }, [routeAddress, user])

  return (
    <div className="w-full pb-1 shadow-md rounded-xl">
      <div className="relative w-full frc-center">
        <div className='absolute z-1 top-2 left-2 right-2'><PlatformBoard change={setProfileType}/></div>
        {profileType !== PlatformType.DESCHOOL ? (<Image
          preview={false}
          src="https://deschool.s3.amazonaws.com/booth/Booth-logos.jpeg"
          fallback={fallbackImage}
          alt="cover"
          className="h-60! object-cover! object-center! rounded-t-xl"
          wrapperClassName="w-full"
        />)
        : (<div className="h-60 object-cover object-center rounded-t-xl overflow-hidden">
            <Jazzicon paperStyles={{ borderRadius: '10px' }} diameter={400} seed={Math.floor(Math.random() * 30)} />
          </div>)
        }
        </div>
      {profileType === PlatformType.LENS &&
        <LensCard
          visitCase={visitCase}
          routeAddress={routeAddress}
        />
      }
      {profileType === PlatformType.CYBERCONNECT &&
        <CyberConnectCard
          visitCase={visitCase}
          routeAddress={routeAddress}
        />
      }
      {profileType === PlatformType.DESCHOOL &&
        <DeschoolCard
          visitCase={visitCase}
          routeAddress={routeAddress}
        />
      }
    </div>
  )
}

export default UserCard
