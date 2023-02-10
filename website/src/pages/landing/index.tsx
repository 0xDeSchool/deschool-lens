import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLayout } from '~/context/layout'
import { useNavigate } from 'react-router'
import HotSeries from './components/HotSeriesCourses'

const LandingHeader = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleJumpExplore = () => {
    navigate('/explore')
  }

  const handleJumpProfile = () => {
    navigate('/profile')
  }

  return (
    <div className="pt-40 pb-20 w-full fcc-center bg-#181818 text-white">
      <h1 className="text-5xl font-Anton">{t('landing.title1')}</h1>
      <h2 className="mt-5 mb-10 text-xl text-white-5 font-Anton">{t('landing.title2')}</h2>
      <div className="w-full frc-center font-ArchivoNarrow">
        <button type="button" className="mr-4 p-2 border border-white rounded-xl text-white text-2xl uppercase" onClick={handleJumpExplore}>
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
