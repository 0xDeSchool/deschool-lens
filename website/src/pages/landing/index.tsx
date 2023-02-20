import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLayout } from '~/context/layout'
import { useNavigate } from 'react-router'
import AnimateBg from '~/components/animateBg'
import HotSeries from './components/HotSeriesCourses'
import HotSBTs from './components/HotSBTs'

const LandingHeader = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleJumpExplore = () => {
    window.open('https://t.me/deschoolcommunity')
  }

  const handleJumpProfile = () => {
    navigate('/profile')
  }

  return (
    <div className="pt-40 pb-20 w-full fcc-center bg-#181818 text-white relative">
      <div className="absolute w-full h-full left-0 top-0">
        <AnimateBg type="line" />
      </div>
      <h1 className="text-5xl font-Anton">{t('landing.title1')}</h1>
      <h2 className="mt-5 mb-10 text-xl text-white-5 font-Anton">{t('landing.title2')}</h2>
      <div className="w-full frc-center font-ArchivoNarrow z-1">
        <button
          type="button"
          className="mr-4 p-2 border border-white rounded-xl text-white hover:text-purple hover:border-purple text-2xl uppercase"
          onClick={handleJumpExplore}
        >
          {t('landing.button1')}
        </button>
        <button type="button" className="p-2 rounded-xl purple-button text-2xl uppercase" onClick={handleJumpProfile}>
          {t('landing.button2')}
        </button>
      </div>
    </div>
  )
}

const LandingBody = () => {
  const { setLayoutPosition } = useLayout()

  useEffect(() => {
    setLayoutPosition({ top: 0 })
  }, [])

  return (
    <div className="w-max mx-10 md:mx-0 md:w-3/4 mt-10 mb-10 fcs-center">
      <HotSeries />
      <HotSBTs />
    </div>
  )
}

/*
 * @description: LandingPage
 * @author: Bianca && fc&&Ricy
 */
const Landing = () => (
  <div className="relative w-full fcc-center scroll-hidden bg-#fafafa">
    <LandingHeader />
    <LandingBody />
  </div>
)
export default Landing
