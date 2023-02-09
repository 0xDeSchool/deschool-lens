import { useEffect } from 'react'

// import { useTranslation } from 'react-i18next'
import { useLayout } from '~/context/layout'

const LandingHeader = () => (
  // const { t } = useTranslation()
  <div className="grid grid-cols-1 mt-96 sm:mt-64 md:mt-0 lg:grid-cols-2 gap-20">LandingHeader</div>
)

const LandingBody = () => {
  // const { t } = useTranslation()
  const { setLayoutPosition } = useLayout()

  useEffect(() => {
    setLayoutPosition({ top: 0 })
  }, [])

  return <div className="grid grid-cols-1 mt-96 sm:mt-64 md:mt-0 lg:grid-cols-2 gap-20">LandingBody</div>
}

/*
 * @description: LandingPage
 * @author: Bianca && fc&&Ricy
 */
const Landing = () => (
  <div className="relative w-full scroll-hidden">
    <LandingHeader />
    <LandingBody />
  </div>
)
export default Landing
