import { useEffect, useState } from 'react'
import { PlatformType } from '~/api/booth/booth'
import IconCyberConnect from '~/assets/icons/cyberConnect.svg'
import IconDeschool from '~/assets/icons/deschool.svg'
import IconLens from '~/assets/icons/lens.svg'

type HeaderLayoutProps = {
  change: (type: PlatformType) => void
}

const normalClass = 'frc-center rounded-full w-36px'
const activeClass = 'pl-12px frc-start w-full rounded-2'

const HeaderLayout: React.FC<HeaderLayoutProps> = (props) => {
  const { change } = props
  const [active, setActive] = useState<PlatformType>(PlatformType.DESCHOOL)

  useEffect(() => {
    if (change) {
      change(active)
    }
  }, [active])

  return (
    <div className='frc-between w-full gap-1 mb-4'>
      <div
        className={`cursor-pointer bg-black h-36px min-h-36px min-w-36px transition-all transition-500 ${active === PlatformType.CYBERCONNECT ? activeClass: normalClass}`}
        onClick={() => setActive(PlatformType.CYBERCONNECT)}
        >
        <img src={IconCyberConnect} alt="cyberconnect" width={24} height={24}/>
        <div className={`ml-2 text-white text-18px font-ArchivoNarrow ${active === PlatformType.CYBERCONNECT ? 'block' : 'hidden'}`}>CyberConnect</div>
      </div>
      <div
        className={`cursor-pointer bg-#abfe2c rounded-full h-36px min-h-36px min-w-36px transition-all transition-500 ${active === PlatformType.LENS ? activeClass: normalClass}`}
        onClick={() => setActive(PlatformType.LENS)}
        >
        <img src={IconLens} alt="lens" width={24} height={24}/>
        <div className={`ml-2 text-#00501E text-18px font-ArchivoNarrow ${active === PlatformType.LENS ? 'block' : 'hidden'}`}>Lens</div>
      </div>
      <div
        className={`cursor-pointer bg-#774ff8 rounded-full h-36px min-h-36px min-w-36px transition-all transition-500 ${active === PlatformType.DESCHOOL ? activeClass: normalClass}`}
        onClick={() => setActive(PlatformType.DESCHOOL)}
        >
        <img src={IconDeschool} alt="deschool" width={24} height={24}/>
        <div className={`ml-2 text-white text-18px font-ArchivoNarrow ${active === PlatformType.DESCHOOL ? 'block' : 'hidden'}`}>DeSchool</div>
      </div>
    </div>
)
}

export default HeaderLayout
