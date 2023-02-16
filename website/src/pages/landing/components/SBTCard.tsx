import Image from 'antd/es/image'
import fallbackImage from '~/assets/images/fallbackImage'
import type { NFTExtend } from '~/lib/types/app'

const SBTCard: React.FC<{ sbt: NFTExtend }> = props => {
  const { sbt } = props

  const handleJumpSbtIntro = (id: string) => {
    const location = window.location.origin
    if (id) window.open(`${location}/sbtIntro/${id}`, '_blank')
  }

  return (
    <div className="fcc-center inline-flex rounded-md bg-white shadow-md w-300px">
      <Image
        preview={false}
        fallback={fallbackImage}
        src={sbt.normalized_metadata.image}
        alt="sbt banner"
        width={300}
        height={300}
        style={{ borderRadius: '6px 6px 0px 0px', background: '#1818180f', objectFit: 'contain' }}
      />
      <div className="w-full flex flex-col items-start justify-start p-24px">
        <a className="font-ArchivoNarrow text-22px leading-30px line-wrap two-line-wrap h-60px cursor-pointer"  onClick={() => handleJumpSbtIntro(sbt?.id)}>
          {sbt?.name}
        </a>
      </div>
    </div>
  )
}

export default SBTCard
