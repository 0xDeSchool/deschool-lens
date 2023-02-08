import ClockCircleOutlined from '@ant-design/icons/lib/icons/ClockCircleOutlined'
import { useTranslation } from 'react-i18next'
import Star6 from '~/assets/images/Star 6.png'
// import RoleTag from './components/RoleTag'
// import Students from './components/Students'

const LeftoffRecord = () => {
  const { t } = useTranslation()
  const courseName = 'Why was crypto invented?'
  const courseDes = 'A wild story of government bailouts, inflations, and bankers who didn’t get punished.'
  const courseTime = '9m'

  return (
    <div
      className="fcc-center md:frc-center w-max mx-auto h-560px md:h-280px bg-#ffffffd8 shadow rounded-md"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* 左边 */}
      <div className="w-400px xl:w-490px h-full p-4 flex flex-col items-start justify-around">
        <h1 className="text-48px font-Anton leading-72px text-#000000d8">{t('leftoff.title1')}</h1>
        <p className="text-18px leading-24px text-#181818a6 font-ArchivoNarrow">{t('leftoff.explain1')}</p>
      </div>
      {/* 右边 */}
      <div className="w-400px xl:w-445px h-full p-4 fcc-center bg-#3F4854 relative" style={{ borderRadius: '0px 4px 4px 0px' }}>
        <img src={Star6} alt="Star6" className="absolute right-0 bottom-0 w-150px h-150px" />
        {/* <div className="w-full frc-between">
          <RoleTag status={0} />
          <span className="text-white font-ArchivoNarrow">{t('lesson')} 1</span>
        </div> */}
        <div className="z-1">
          <h1 className="font-ArchivoNarrow text-white text-24px leading-32px">{courseName}</h1>
          <p className="font-ArchivoNarrow text-#ffffffd8 text-16px leading-24px">{courseDes}</p>
          <div className="frc-start">
            <ClockCircleOutlined color="#ffffffd8" size={12} />
            <span className="text-#ffffffd8 font-ArchivoNarrow text-12px leading-20px ml-2">{courseTime}</span>
          </div>
          {/* <Students count={1163} /> */}
          <div className="frc-start">
            <button type="button" className="rounded text-14px text-#2B3139 bg-white mr-4 p-2">
              {t('startLearn')}
            </button>
            {/* <button type="button" className="border border-#ffffff26 text-14px text-white rounded p-2">
              {t('startForReward')}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftoffRecord
