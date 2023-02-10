import { useTranslation } from 'react-i18next'
// import LeftoffRecord from './LeftoffRecord'
// import HotSeries from './HotSeries'
// import HotCourses from './HotCourses'
// import HotChannels from './HotChannels'

const Explore = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full h-fit pb-10 overflow-auto relative bg-#fafafa">
      {/* banner */}
      <img src="" alt="explore" className="absolute right-0 xl:right-36 z-1 w-640px" />
      <div className="bg-#2B3139 w-full h-607px relative">
        <div className="w-400px h-300px left-40px top-240px md:left-120px xl:left-168px xl:top-103px text-white text-shadow-xl uppercase absolute z-2">
          <h1 className="font-Anton font-400 text-88px leading-100px whitespace-pre">{t('explore.title1')}</h1>
          <h1 className="font-Anton font-400 text-88px leading-100px">{t('explore.title2')}</h1>
          <h1 className="font-Anton font-400 text-88px leading-100px">{t('explore.title3')}</h1>
        </div>
      </div>
      <div className="w-full h-max flex flex-col justify-center explore">
        explore
        {/* <div className="w-full mx-auto mt-0 md:mt--120px p-10 z-2">
          <LeftoffRecord />
        </div>
        <HotSeries />
        <HotCourses />
        <HotChannels /> */}
      </div>
    </div>
  )
}

export default Explore
