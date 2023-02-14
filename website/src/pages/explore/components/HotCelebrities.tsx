import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star1 from '~/assets/images/star1.png'
import Skeleton from 'antd/es/skeleton'
import { ProfileSortCriteria } from '~/api/lens/graphql/generated'
import { exploreProfilesRequest } from '~/api/lens/profile/get-profiles'
import Empty from 'antd/es/empty'
import { getExtendProfile } from '~/hooks/profile'
import CelebrityCard from './CelebrityCard'
import type { ProfileExtend } from '~/lib/types/app'

const HotCelebrities = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [celebrities, setCelebrities] = useState([] as ProfileExtend[])

  const initSeries = async () => {
    setLoading(true)
    try {
      const response = await exploreProfilesRequest({
        sortCriteria: ProfileSortCriteria.MostFollowers,
        // cursor?: InputMaybe<Scalars['Cursor']>;
        // customFilters?: InputMaybe<Array<CustomFiltersTypes>>;
        limit: 9,
        // timestamp?: InputMaybe<Scalars['TimestampScalar']>;
      })
      /* loop over profiles, create properly formatted ipfs image links */
      const profilesData = await Promise.all(response.items.map(async (profileInfo: any) => getExtendProfile(profileInfo)))
      setCelebrities(profilesData as ProfileExtend[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initSeries()
  }, [])

  return (
    <div className="fcc-center mb-20">
      <div className="w-auto">
        {/* 标题 */}
        <div className="frc-center my-20">
          <img src={Star1} alt="star1" className="w-80px h-80px" />
          <h1 className="text-4xl text-left ml-4 font-Anton flex-1">{t('explore.title2')}</h1>
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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-auto">
            {celebrities && celebrities.length > 0 ? (
              celebrities.map(celebrity => <CelebrityCard key={celebrity.id} celebrity={celebrity} index={celebrity.id} />)
            ) : (
              <Empty />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HotCelebrities
