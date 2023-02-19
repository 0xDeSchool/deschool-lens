import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star1 from '~/assets/images/star1.png'
import Skeleton from 'antd/es/skeleton'
import { getProfilesRequest } from '~/api/lens/profile/get-profiles'
import Empty from 'antd/es/empty'
import { getExtendProfile } from '~/hooks/profile'
import { PlatformType, getBoothUsers } from '~/api/booth/booth'
import { getOtherUserProfile } from '~/api/go/account'
import CelebrityCard from './CelebrityCard'
import type { Creator, ProfileExtend } from '~/lib/types/app'

const HotCelebrities = (props: { searchWord: string }) => {
  const { searchWord } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [celebrities, setCelebrities] = useState([] as ProfileExtend[] | Creator[])
  const [cacheCelebrities, setCacheCelebrities] = useState([] as any[])

  // 将deschool数据转换成lens profile也支持的数据
  const getTransformed = (ds: (Creator | null)[]) => {
    const temp: { avatarUrl: string; name: string; bio: string | undefined; id: string | undefined }[] = []
    ds.forEach(d => {
      if (d) {
        temp.push({
          avatarUrl: d.avatar,
          name: d.username,
          bio: d.bio,
          id: d.id,
        })
      }
    })
    return temp
  }

  // 合并地址相同的人
  // const mergeDateByAddress = (data: any[]) => {
  //   const temp = [] as any[]
  //   data.forEach(user => {
  //     // deschool 数据
  //     if (user.address) {
  //       const indexA = temp.findIndex(existUser => existUser.ownedBy === user.address)
  //       // 已经存过对应的lens数据
  //       if (indexA > -1) {
  //         temp[indexA].avatar = user.avatar
  //         temp[indexA].username = user.username
  //         temp[indexA].bio = user.bio
  //       } else {
  //         temp.push(user)
  //       }
  //     }
  //     // lens 数据
  //     else {
  //       const indexB = temp.findIndex(existUser => existUser.address === user.ownedBy)
  //       // 已经存过对应的deschool数据
  //       if (indexB > -1) {
  //         temp[indexB].handle = user.handle
  //       } else {
  //         temp.push(user)
  //       }
  //     }
  //   })
  //   return temp
  // }

  const initSeries = async () => {
    setLoading(true)
    try {
      const response = await getBoothUsers()
      // lens 用户
      const lensUsers = response.filter((user: { platform: PlatformType }) => user.platform === PlatformType.LENS)
      const lensUsersProfiles: any = await getProfilesRequest({
        handles: lensUsers.map((lu: { lensHandle: any }) => lu.lensHandle),
      })
      /* loop over profiles, create properly formatted ipfs image links */
      const profilesData = lensUsersProfiles?.items
        ? lensUsersProfiles.items.map((profileInfo: any, index: number) => ({
            ...getExtendProfile(profileInfo),
            address: lensUsers[index].address,
          }))
        : []

      // deschool 用户
      const deschoolUsers = response.filter((user: { platform: PlatformType }) => user.platform === PlatformType.DESCHOOL)
      const deschoolProfilesData = await Promise.all(
        deschoolUsers.map(async (profileInfo: any) => getOtherUserProfile(profileInfo.address)),
      )
      const allData = profilesData.concat(getTransformed(deschoolProfilesData))

      // 合并同地址数据
      const tempDatas = allData // mergeDateByAddress(allData)
      setCelebrities(tempDatas)
      setCacheCelebrities(tempDatas)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initSeries()
  }, [])

  useEffect(() => {
    setCelebrities(
      cacheCelebrities.filter(c => c.handle?.includes(searchWord) || c.name?.includes(searchWord) || c.id?.includes(searchWord)),
    )
  }, [searchWord])

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
