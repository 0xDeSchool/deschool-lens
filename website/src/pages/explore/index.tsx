import Input from 'antd/es/input/Input'
import { useTranslation } from 'react-i18next'
import AnimateBg from '~/components/animateBg'
import HotCelebrities from './components/HotCelebrities'
// import LeftoffRecord from './LeftoffRecord'
// import HotSeries from './HotSeries'
// import HotCourses from './HotCourses'
// import HotChannels from './HotChannels'

const Explore = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full overflow-auto relative fcc-center">
      <div className="w-full h-full fcc-center relative overflow-hidden">
        <div className="absolute w-full h-full top-0 left-0">
          <AnimateBg />
        </div>
        <div className="w-3/4 mt-40 mb-30 h-fit relative fcs-center">
          <h1 className="text-5xl font-Anton text-white">{t('explore.title1')}</h1>
          <Input className="mt-10 mb-5 w-2/3 min-w-300px" size="large" />
          <h3 className="text-2xl text-gray-5 font-ArchivoNarrow">{t('explore.searchTips')}</h3>
        </div>
      </div>
      <div className="w-full h-max fcc-center">
        <HotCelebrities />
      </div>
    </div>
  )
}

export default Explore
