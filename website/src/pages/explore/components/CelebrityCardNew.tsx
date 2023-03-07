import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconCyberConnect from '~/assets/icons/cyberConnect.svg'
import IconDeschool from '~/assets/icons/deschool.svg'
import IconLens from '~/assets/icons/lens.svg'
import Image from 'antd/es/image'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { DEFAULT_AVATAR } from '~/context/account'
import { getShortAddress } from '~/utils/format'
import { UserInfo } from '~/api/booth/types'
import { PlatformType } from '~/api/booth/booth'

const normalClass = 'frc-center rounded-full w-36px'
const activeClass = 'pl-12px frc-start w-full rounded-2'

type CelebrityCardNewProps = UserInfo & {
  followerCount?: number,
  followingCount?: number,
  isFollowing?: boolean,
  followerDetail?: () => void,
  followingDetail?: () => void,
}

const CelebrityCardNew: React.FC<CelebrityCardNewProps> = (props) => {
  const { t } = useTranslation()
  const { avatar, address, displayName, platforms, bio, isFollowing, followerCount, followingCount, followerDetail, followingDetail } = props
  const [active, setActive] = useState<PlatformType>(PlatformType.DESCHOOL)
  const [handle, setHandle] = useState<string>('')

  useEffect(() => {
    if (platforms?.length) {
      const platform = platforms?.find(p => p.platform === active)
      if (platform) {
        setHandle(platform.handle || '')
      }
    }
  }, [platforms, active])

  return (
    <div className="fcs-center px-6 py-8 bg-white rounded-md shadow-md w-375px">
      {/* header */}
      <div className='frc-between w-full gap-1 mb-4'>
        <div
          className={`cursor-pointer bg-black h-36px min-h-36px min-w-36px transition-all transition-500 ${active === PlatformType.CYBERCONNECT ? activeClass : normalClass}`}
          onClick={() => setActive(PlatformType.CYBERCONNECT)}
        >
          <img src={IconCyberConnect} alt="cyberconnect" width={24} height={24} />
          <div className={`ml-2 text-white text-18px font-ArchivoNarrow ${active === PlatformType.CYBERCONNECT ? 'block' : 'hidden'}`}>CyberConnect</div>
        </div>
        <div
          className={`cursor-pointer bg-#abfe2c rounded-full h-36px min-h-36px min-w-36px transition-all transition-500 ${active === PlatformType.LENS ? activeClass : normalClass}`}
          onClick={() => setActive(PlatformType.LENS)}
        >
          <img src={IconLens} alt="lens" width={24} height={24} />
          <div className={`ml-2 text-#00501E text-18px font-ArchivoNarrow ${active === PlatformType.LENS ? 'block' : 'hidden'}`}>Lens</div>
        </div>
        <div
          className={`cursor-pointer bg-#774ff8 rounded-full h-36px min-h-36px min-w-36px transition-all transition-500 ${active === PlatformType.DESCHOOL ? activeClass : normalClass}`}
          onClick={() => setActive(PlatformType.DESCHOOL)}
        >
          <img src={IconDeschool} alt="deschool" width={24} height={24} />
          <div className={`ml-2 text-white text-18px font-ArchivoNarrow ${active === PlatformType.DESCHOOL ? 'block' : 'hidden'}`}>DeSchool</div>
        </div>
      </div>
      {/* content */}
      {/* user info */}
      <div className='mx-auto fcc-center mb-8'>
        <div className="relative frc-center ml-24px mt-24px mb-4">
          {avatar ? (
            <Image
              preview={false}
              alt="user avatar"
              className="w-86px! h-86px! mb-4px rounded-full"
              src={avatar}
              fallback={DEFAULT_AVATAR}
              style={{ display: 'inline-block' }}
            />
          ) : (
            <Jazzicon diameter={86} seed={Math.floor(Math.random() * 1000)} />
          )}
          <svg className="absolute bottom-0" width="92" height="48" viewBox="0 0 92 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90 2C90 26.3005 70.3005 46 46 46C21.6995 46 2 26.3005 2 2" stroke="#774FF8" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="font-Anton text-black text-24px leading-32px h-32px line-wrap two-line-wrap">
          {displayName === address ? getShortAddress(address) : displayName}
        </h1>
      </div>
      {/* follows info */}
      <div className="mx-auto frc-center gap-8 flex-wrap">
        <a
          className={`${followerCount && followerCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followerDetail && followerDetail()
          }}
        >
          <span className="text-black">{followerCount || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
        </a>
        <a
          className={`${followingCount && followingCount > 0 ? 'hover:underline hover:cursor-pointer' : ''
            } text-xl`}
          onClick={() => {
            followingDetail && followingDetail()
          }}
        >
          <span className="text-black">{followingCount || '-'} </span>
          <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
        </a>
      </div>
      <p className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-120px line-wrap three-line-wrap">
        {bio}
      </p>
      <Button type='primary' className='mx-auto px-8'>{!isFollowing ? 'Follow' : 'Unfollow'}</Button>
    </div>
  )
}

export default CelebrityCardNew
