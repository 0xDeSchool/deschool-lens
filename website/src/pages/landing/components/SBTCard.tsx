import Image from 'antd/es/image'
import { useTranslation } from 'react-i18next'
import fallbackImage from '~/assets/images/fallbackImage'
import type { NFTExtend } from '~/lib/types/app'

const SBTCard = (props: { sbt: NFTExtend }) => {
  const { sbt } = props
  const { t } = useTranslation()

  const handleJumpSbtIntro = (id: string) => {
    if (id) window.open(`https://dev.deschool.app/passIntro/${id}`, '_blank')
  }

  return (
    <div className="fcc-center inline-flex rounded-md bg-white shadow-md w-200px">
      <Image
        preview={false}
        fallback={fallbackImage}
        src={sbt.normalized_metadata.image}
        alt="sbt banner"
        width={200}
        height={200}
        style={{ borderRadius: '6px 6px 0px 0px', background: '#1818180f', objectFit: 'contain' }}
      />
      <div className="w-full flex flex-col items-start justify-start p-24px">
        <span className="font-Anton text-24px leading-32px">{sbt?.name}</span>
        <div className="mt-4 z-1 frc-start">
          <button
            type="button"
            className="rounded text-14px text-white bg-#774FF8 mr-4 p-2"
            onClick={() => {
              handleJumpSbtIntro(sbt?.id)
            }}
          >
            {t('startLearn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SBTCard
