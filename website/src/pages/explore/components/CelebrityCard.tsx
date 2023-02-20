import { useTranslation } from 'react-i18next'
import Image from 'antd/es/image'
import { useNavigate } from 'react-router'
import { getShortAddress } from '~/utils/format'
import { DEFAULT_AVATAR } from '~/context/account'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'

export type CelebrityType = {
  deschool: {
    username: string
    address: string
    avatar: string
    bio: string
  }
  lens: {
    name: string
    ownedBy: string
    avatarUrl: string
    handle: string
    bio: string
  }
}
const CelebrityCard = (props: { celebrity: CelebrityType }) => {
  const { celebrity } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleJumpProfile = () => {
    navigate(`/profile/${celebrity.deschool?.address || celebrity.lens?.ownedBy}/resume`)
  }

  return (
    <div className="fcs-center inline-flex bg-white rounded-md shadow-md m-2 col-span-1">
      <div className="relative frc-center ml-24px mt-24px">
        {celebrity.deschool?.avatar || celebrity.lens?.avatarUrl ? (
          <Image
            preview={false}
            alt="user avatar"
            className="w-86px! h-86px! mb-4px rounded-full"
            src={celebrity.deschool?.avatar ? celebrity.deschool.avatar : celebrity.lens?.avatarUrl}
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
      <div className="w-357px flex flex-col items-start justify-start p-24px">
        {/* <RoleTag status={0} /> */}
        <div className="z-1 flex flex-col items-start justify-start">
          <h1 className="font-Anton text-black text-24px leading-32px h-32px line-wrap two-line-wrap">
            {celebrity.deschool?.username ||
              celebrity.lens?.name ||
              (celebrity.deschool?.address && getShortAddress(celebrity.deschool?.address))}
          </h1>
          {celebrity.lens?.handle ? (
            <h2 className="leading-32px font-ArchivoNarrow from-brand-600 dark:from-brand-400 bg-gradient-to-r to-pink-600 bg-clip-text text-transparent dark:to-pink-400">
              @{celebrity.lens?.handle}
            </h2>
          ) : (
            <h2 className="leading-32px font-ArchivoNarrow text-18px text-gray-6 leading-32px h-64px line-wrap two-line-wrap">
              {celebrity.deschool?.address}
            </h2>
          )}
          <p className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-120px line-wrap three-line-wrap">
            {celebrity.deschool?.bio || celebrity.lens?.bio}
          </p>
          <div className="frc-start">
            {/* <Link to={`/profile/${celebrity.handle}/resume`}> */}
            <button
              type="button"
              className="rounded text-14px text-white bg-#774FF8 mr-4 p-2"
              onClick={() => {
                handleJumpProfile()
              }}
            >
              {t('LearnMore')}
            </button>
            {/* </Link> */}

            {/* <button type="button" className="border border-#00000026 text-14px text-black rounded p-2">
              {t('startForReward')}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CelebrityCard
