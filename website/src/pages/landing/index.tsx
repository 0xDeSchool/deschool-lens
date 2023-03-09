import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLayout } from '~/context/layout'
import { useNavigate } from 'react-router'
import AnimateBg from '~/components/animateBg'
import HotSeries from './components/HotSeriesCourses'
import HotSBTs from './components/HotSBTs'
import { NavLink } from 'react-router-dom'
import Button from 'antd/es/button'
import Image from 'antd/es/image'

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
      {/* <h1 className="text-5xl font-Anton">{t('landing.title1')}</h1> */}
      {/* <h2 className="mt-5 mb-10 text-xl text-white-5 font-Anton">{t('landing.title2')}</h2> */}
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

type LandingBoardItemProps = {
  title: string
  banner: string
  btnText: string
  routePath: string
}
const LandingBoardItem = ({ title, banner, btnText, routePath }: LandingBoardItemProps) => {
  return (
    <div className='mx-auto w-100% mb-24'>
      <h2 className="mx-auto text-3xl text-center font-ArchivoNarrow ">{title}</h2>
      <img src={banner} alt="banner" style={{width: '80vw', height: 'auto'}}/>
      <NavLink to={routePath} className="frc-center">
        <Button >{btnText}</Button>
      </NavLink>
    </div>
  )
}
const LandingBody = () => {
  const { setLayoutPosition } = useLayout()
  const { t } = useTranslation()
  useEffect(() => {
    setLayoutPosition({ top: 0 })
  }, [])

  return (
    <div className="w-max mx-10 md:mx-0 md:w-3/4 mt-10 mb-10 fcs-center">
      {/* <HotSeries />
      <HotSBTs /> */}
      <LandingBoardItem
        title={t('landing.title3')}
        btnText={t('landing.button3')}
        banner="https://deschool.s3.amazonaws.com/static/image_2023-03-09_14-57-09.png"
        routePath='/profile/resume'/>
      <LandingBoardItem
        title={t('landing.title4')}
        btnText={t('landing.button4')}
        banner="https://deschool.s3.amazonaws.com/static/image_2023-03-09_14-58-47.png"
        routePath='/profile/match'/>
      <LandingBoardItem
        title={t('landing.title5')}
        btnText={t('landing.button5')}
        banner="https://deschool.s3.amazonaws.com/static/image_2023-03-09_15-00-38.png"
        routePath='/learnTogether'/>
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
