import { t } from 'i18next'
import type { Dispatch, SetStateAction } from 'react'
import Deschool from '~/assets/icons/deschool.svg'
import Lens from '~/assets/icons/lens.svg'
import IconCyberConnect from '~/assets/icons/cyberConnect.svg'

const SwitchIdentity = (props: { setProfileType: Dispatch<SetStateAction<string>>; profileType: string }) => {
  const { setProfileType, profileType } = props

  return (
    <div className="w-full frc-between absolute top-3 z-1">
      <span
        className={`cursor-pointer transition frc-center bg-#abfe2c ${
          profileType === 'lens' ? 'flex-1 rounded-xl border border-#00ae00 px-4' : 'p-1 w-32px overflow-hidden rounded-full'
        } ml-2 mr-4`}
        onClick={e => {
          e.preventDefault()
          setProfileType('lens')
        }}
      >
        <img src={Lens} alt="lens" className="w-20px h-24px" />
        <button
          type="button"
          className={`text-black text-14px leading-32px ml-2 font-ArchivoNarrow ${profileType === 'lens' ? '' : 'hidden'}`}
        >
          {t('profile.lens')}
        </button>
      </span>
      <span
        className={`cursor-pointer transition frc-center bg-black ${
          profileType === 'cyber' ? 'flex-1 rounded-xl border border-black px-4' : 'p-1 w-32px overflow-hidden rounded-full'
        } ml-2 mr-4`}
        onClick={e => {
          e.preventDefault()
          setProfileType('cyber')
        }}
      >
        <img src={IconCyberConnect} alt="cyberconnect" className="w-20px h-20px" />
        <button
          type="button"
          className={`text-white text-14px leading-32px ml-2 font-ArchivoNarrow ${profileType === 'cyber' ? '' : 'hidden'}`}
        >
          {t('profile.cyberconnect')}
        </button>
      </span>
      <span
        className={`cursor-pointer transition frc-center bg-#774ff8 ${
          profileType === 'deschool' ? 'flex-1 rounded-xl border border-#6c3eff px-4' : 'p-1 w-32px overflow-hidden rounded-full'
        } mr-2`}
        onClick={e => {
          e.preventDefault()
          setProfileType('deschool')
        }}
      >
        <img src={Deschool} alt="lens" className="w-20px h-24px" />
        <button
          type="button"
          className={`text-white text-14px leading-32px ml-2 font-ArchivoNarrow ${profileType === 'deschool' ? '' : 'hidden'}`}
        >
          {t('profile.deschool')}
        </button>
      </span>
    </div>
  )
}

export default SwitchIdentity
