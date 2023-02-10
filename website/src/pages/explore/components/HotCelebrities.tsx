import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star1 from '~/assets/images/star1.png'
import Skeleton from 'antd/es/skeleton'
import type { ProfileExtend } from '~/lib/types/app.d.ts'
import { ProfileSortCriteria } from '~/api/lens/graphql/generated'
import { exploreProfilesRequest } from '~/api/lens/profile/get-profiles'
import CelebrityCard from './CelebrityCard'

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
      const profilesData = await Promise.all(
        response.items.map(async (profileInfo: any) => {
          const profile = { ...profileInfo }
          const { picture } = profile
          if (picture && picture.original && picture.original.url) {
            if (picture.original.url.startsWith('ipfs://')) {
              const result = picture.original.url.substring(7, picture.original.url.length)
              profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
            } else {
              profile.avatarUrl = picture.original.url
            }
          }
          return profile
        }),
      )
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
          <h1 className="text-4xl text-center font-Anton flex-1">{t('explore.title2')}</h1>
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
            {celebrities.map(celebrity => (
              <CelebrityCard key={celebrity.id} celebrity={celebrity} index={celebrity.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HotCelebrities
