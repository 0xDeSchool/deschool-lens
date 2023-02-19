import { useTranslation } from 'react-i18next'
import Avatar from 'antd/es/avatar'
import { DEFAULT_AVATAR } from '~/context/account'
import { useNavigate } from 'react-router'

const CelebrityCard = (props: { celebrity: any; index: number }) => {
  const { celebrity } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleJumpProfile = () => {
    navigate(`/profile/${celebrity.address}/resume`)
  }

  return (
    <div className="fcs-center inline-flex bg-white rounded-md shadow-md m-2 col-span-1">
      <div className="relative frc-center ml-24px mt-24px">
        <Avatar
          size={86}
          alt="user avatar"
          className="w-86px h-86px mb-4px rounded-full"
          // eslint-disable-next-line no-nested-ternary
          src={celebrity?.avatarUrl ? celebrity?.avatarUrl : DEFAULT_AVATAR}
          style={{ display: 'inline-block' }}
        />
        <svg className="absolute bottom-0" width="92" height="48" viewBox="0 0 92 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 2C90 26.3005 70.3005 46 46 46C21.6995 46 2 26.3005 2 2" stroke="#774FF8" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="w-357px flex flex-col items-start justify-start p-24px">
        {/* <RoleTag status={0} /> */}
        <div className="z-1 flex flex-col items-start justify-start">
          <h1 className="font-Anton text-black text-24px leading-32px h-64px mb-24px line-wrap two-line-wrap">{celebrity?.username}</h1>
          <h1 className="font-Anton text-black text-24px leading-32px h-64px mb-24px line-wrap two-line-wrap">{celebrity?.handle}</h1>
          <p className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-120px line-wrap three-line-wrap">{celebrity?.bio}</p>
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
