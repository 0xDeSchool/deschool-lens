import { t } from 'i18next'
import type { Dispatch, SetStateAction } from 'react'
import Deschool from '~/assets/icons/deschool.svg'
import Lens from '~/assets/icons/lens.svg'
import { useAccount } from '~/context/account'

const SwitchIdentity = (props: { setProfileType: Dispatch<SetStateAction<string>>; profileType: string }) => {
  const { setProfileType, profileType } = props
  const { lensProfile } = useAccount()

  return (
    <div className="frc-between absolute">
      <span
        className={`flex-1 frc-center bg-#abfe2c ${
          profileType === 'lens' ? 'rounded-xl border border-#00ae00' : 'rounded-xl'
        } px-4 mr-4`}
        onClick={e => {
          e.preventDefault()
          setProfileType('lens')
        }}
      >
        <img src={Lens} alt="lens" width={24} height={24} />
        <button type="button" className="text-black text-14px leading-26px ml-2 font-ArchivoNarrow">
          {lensProfile ? lensProfile?.handle : t('profile.lens')}
        </button>
      </span>
      <span
        className={`flex-1 frc-center bg-#774ff8 ${
          profileType === 'deschool' ? 'rounded-xl border border-#6c3eff' : 'rounded-xl'
        } px-4`}
        onClick={e => {
          e.preventDefault()
          setProfileType('deschool')
        }}
      >
        <img src={Deschool} alt="lens" width={20} height={24} />
        <button type="button" className="text-white text-14px leading-26px ml-2 font-ArchivoNarrow">
          {t('profile.deschool')}
        </button>
      </span>
    </div>
  )
}

export default SwitchIdentity
