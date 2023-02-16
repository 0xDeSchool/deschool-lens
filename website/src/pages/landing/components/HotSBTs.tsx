import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star1 from '~/assets/images/star1.png'
import Skeleton from 'antd/es/skeleton'
import SBTCard from './SBTCard'
import type { NFTExtend } from '~/lib/types/app'

const HotSBTs = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [sbts, setSBTs] = useState<NFTExtend[]>([] as NFTExtend[])
  const [total, setTotal] = useState(0)

  const initSBTs = async () => {
    setLoading(true)
    try {
      //   const sortStr = '-updatedAt'
      //   const res: any = await getExploreSeries(1, 6, sortStr)
      const res: { items: NFTExtend[]; totalCount: number } = {
        items: [
          {
            id: '63243de3b4220dd9474340bf',
            amount: 1,
            metadata: '0x0D9ea891B4C30e17437D00151399990ED7965F00|157',
            name: 'PoSK-SeedaoOnboarding',
            normalized_metadata: {
              description: '完成SeeDAO Onboarding 课程证明',
              image: 'https://deschool.s3.amazonaws.com/PoskImg/78a60abcfdf10.png',
              name: 'PoSK-SeedaoOnboarding',
            },
            token_address: '0x0D9ea891B4C30e17437D00151399990ED7965F00',
          },
          {
            id: '63d76e5bcdc0544bb705a5b6',
            amount: 1,
            metadata: '0x0D9ea891B4C30e17437D00151399990ED7965F00|254',
            name: 'PSPC 小课堂 #1 学习凭证',
            normalized_metadata: {
              description: 'PSPC 小课堂 #1 学习凭证',
              image: 'https://i.seadn.io/gcs/files/74730ab0028180da4149bf1249b6b5c3.jpg?auto=format&w=1000',
              name: 'PSPC 小课堂 #1 学习凭证',
            },
            token_address: '0x0D9ea891B4C30e17437D00151399990ED7965F00',
          },
        ],
        totalCount: 2,
      }
      if (res && res.items) {
        setSBTs(res.items)
        setTotal(res.totalCount)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleViewAll = async () => {
    window.open('https://opensea.io/collection/deschool-posk', '_blank')
  }

  useEffect(() => {
    initSBTs()
  }, [])

  return (
    <div className="w-full fcc-center">
      <div className="w-auto">
        {/* 标题 */}
        <div className="fcc-center">
          <div className="relative text-left w-3/4">
            <img src={Star1} alt="star1" className="w-80px h-80px" />
          </div>
          <h1 className="text-56px leading-84px text-center font-ArchivoNarrow w-400px md:w-680px">{t('landing.hotSbts')}</h1>
          <p className="text-24px leading-32px font-ArchivoNarrow w-400px md:w-max">{t('landing.hotSbtDes')}</p>
        </div>

        {/* 热门系列课程 */}
        {loading ? (
          <div className="grid gap-4 grid-cols-3 m-auto">
            <div className="w-357px shadow-md">
              <Skeleton.Image active style={{ width: '357px', height: '195px' }} className="mb-4 mx-auto" />
              <Skeleton active />
            </div>
            <div className="w-357px shadow-md">
              <Skeleton.Image active style={{ width: '357px', height: '195px' }} className="mb-4 mx-auto" />
              <Skeleton />
            </div>
            <div className="w-357px shadow-md">
              <Skeleton.Image active style={{ width: '357px', height: '195px' }} className="mb-4 mx-auto" />
              <Skeleton active />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-3 m-auto">
            {sbts.map(sbt => (
              <SBTCard key={sbt.metadata} sbt={sbt} />
            ))}
          </div>
        )}
        {total > sbts.length && (
          <div className="text-center mt-10">
            <button type="button" className="bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2 uppercase" onClick={handleViewAll}>
              {t('landing.seeallcourse')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotSBTs
