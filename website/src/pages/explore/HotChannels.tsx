import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star4 from '~/assets/images/Star4.png'
import { getExploreChannels } from '~/api/explore'
import Skeleton from 'antd/es/skeleton'
import { useNavigate } from 'react-router'
import layoutWidth from '~/styles/shortcut'
import ChannelCard from './components/ChannelCard'
import type { Org } from '~/lib/types/app'

const HotChannels = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [channels, setChannels] = useState([] as Org[])
  const navigate = useNavigate()

  const initChannels = async () => {
    setLoading(true)
    try {
      const res: any = await getExploreChannels(1, 3, '-updatedAt')
      if (res) {
        setChannels(res)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initChannels()
  }, [])

  const handleJumpAllChannels = () => {
    navigate(`/orglist`)
  }

  return (
    <div className="fcc-center mt-32">
      <div className="w-auto">
        {/* 标题 */}
        <div className="fcc-center">
          <h1 className="text-36px leading-84px text-center font-Anton w-400px md:w-680px relative">
            {' '}
            <img src={Star4} alt="star4" className="w-36px h-36px absolute top--6px left-40px" />
            {t('hotChannels.title')}
          </h1>
          <p className="text-24px leading-32px font-ArchivoNarrow w-400px md:w-767px text-center">{t('hotChannels.description')}</p>
        </div>
        {/* 热门课程 */}
        {loading ? (
          <div className={`frc-center flex-wrap ${layoutWidth} m-auto`}>
            <div className="w-357px shadow-md p-4">
              <Skeleton.Image style={{ width: '320px', height: '195px' }} className="mb-4" />
              <Skeleton />
            </div>
            <div className="w-357px mx-4 shadow-md p-4">
              <Skeleton.Image style={{ width: '320px', height: '195px' }} className="mb-4" />
              <Skeleton />
            </div>
            <div className="w-357px shadow-md p-4">
              <Skeleton.Image style={{ width: '320px', height: '195px' }} className="mb-4" />
              <Skeleton />
            </div>
          </div>
        ) : (
          <div className={`frs-center flex-wrap ${layoutWidth} m-auto`}>
            {channels.map((org, index) => (
              <ChannelCard key={org.id} org={org} index={index} />
            ))}
          </div>
        )}
        {channels.length > 0 && (
          <div className="text-center mt-10">
            <button
              type="button"
              className="bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2"
              onClick={() => {
                handleJumpAllChannels()
              }}
            >
              {t('SeeAllChannels')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotChannels
