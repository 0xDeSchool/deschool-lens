import Image from 'antd/es/image'
import { useTranslation } from 'react-i18next'
import fallbackImage from '~/assets/images/fallbackImage'
import CrownIcon from '~/assets/icons/crown.png'
// import RoleTag from './RoleTag'
import type { SeriesExtend } from '~/lib/types/app'

const SeriesCard = (props: { series: SeriesExtend }) => {
  const { series } = props
  const { t } = useTranslation()

  const handleJumpOrgIntro = (channelDomain: string) => {
    if (channelDomain) window.open(`https://dev.deschool.app/org/${channelDomain}`, '_blank')
  }
  const handleJumpPassIntro = (passId: string) => {
    if (passId) window.open(`https://dev.deschool.app/passIntro/${passId}`, '_blank')
  }
  const handleJumpSeriesIntro = (seriesId: string) => {
    if (seriesId) window.open(`https://dev.deschool.app/series/seriesintro/${seriesId}`, '_blank')
  }

  return (
    <div className="fcc-center inline-flex rounded-md bg-white shadow-md w-357px">
      <Image
        preview={false}
        fallback={fallbackImage}
        src={series.coverImage}
        alt="series banner"
        width={357}
        height={195}
        style={{ borderRadius: '6px 6px 0px 0px', background: '#1818180f' }}
      />
      <div className="w-full flex flex-col items-start justify-start p-24px">
        {/* <RoleTag status={0} /> */}
        <div className="w-full frc-between">
          <div
            className="frc-start cursor-pointer"
            onClick={() => {
              handleJumpOrgIntro(series.channel?.domain)
            }}
          >
            <Image
              preview={false}
              fallback={fallbackImage}
              src={series?.channel?.logo}
              alt={series?.channel?.name}
              width={32}
              height={32}
            />
            <span className="font-Anton text-24px leading-32px">{series?.channel?.name}</span>
          </div>
          <div className="uppercase flex-1 inline-flex items-center justify-end font-Anton">
            <span
              className={`w-fit p-1 cursor-pointer ${
                series.passes?.length ? 'bg-gray-100 border border-solid border-gray-300' : 'h-[32px]'
              }`}
              onClick={() => {
                handleJumpPassIntro(series.passes ? series.passes[0].id : '')
              }}
            >
              {series.passes?.length && series.passes?.length > 0 ? (
                <span
                  className="text-#6525FF font-ArchivoNarrow flex flex-row items-center text-12px"
                  title={t('includedIn') + series.passes[0].name}
                >
                  <img src={CrownIcon} className="mr-2" style={{ width: '20px', height: '20px' }} alt="NFT Pass" />
                  {series.passes[0].name}
                </span>
              ) : null}
            </span>
          </div>
        </div>
        <div className="mt-4 z-1">
          <h1 className="font-ArchivoNarrow text-black text-24px leading-32px mb-2 line-wrap one-line-wrap" title={series.title}>
            {series.title}
          </h1>
          <p
            className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-72px line-wrap three-line-wrap"
            title={series.description}
          >
            {series.description}
          </p>
          <div className="frc-start">
            <button
              type="button"
              className="rounded text-14px text-white bg-#774FF8 mr-4 p-2"
              onClick={() => {
                handleJumpSeriesIntro(series.id)
              }}
            >
              {t('startLearn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeriesCard
