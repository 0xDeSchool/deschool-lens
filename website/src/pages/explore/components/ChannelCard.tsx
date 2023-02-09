import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import fallbackImage from '~/assets/images/fallbackImage'
import type { Org } from '~/lib/types/app'
// import RoleTag from './RoleTag'

const ChannelCard = (props: { org: Org; index: number }) => {
  const { org } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleJumpChannel = (channelDomian: string) => {
    if (channelDomian) navigate(`/org/${channelDomian}`)
  }

  return (
    <div className="fcs-center inline-flex bg-white rounded-md shadow-md m-2">
      <div className="relative frc-center ml-24px mt-24px">
        <img src={fallbackImage} srcSet={org.logo} alt="org logo" className="w-86px h-86px mb-4px rounded-full" />
        <svg className="absolute bottom-0" width="92" height="48" viewBox="0 0 92 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 2C90 26.3005 70.3005 46 46 46C21.6995 46 2 26.3005 2 2" stroke="#774FF8" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="w-357px flex flex-col items-start justify-start p-24px">
        {/* <RoleTag status={0} /> */}
        <div className="z-1 flex flex-col items-start justify-start">
          <h1 className="font-Anton text-black text-24px leading-32px mb-24px">{org.name}</h1>
          <p className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-216px">{org.description}</p>
          <div className="frc-start">
            <button
              type="button"
              className="rounded text-14px text-white bg-#774FF8 mr-4 p-2"
              onClick={() => {
                handleJumpChannel(org.domain)
              }}
            >
              {t('LearnMore')}
            </button>
            {/* <button type="button" className="border border-#00000026 text-14px text-black rounded p-2">
              {t('startForReward')}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChannelCard
