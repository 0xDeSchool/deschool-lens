import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Star1 from '~/assets/images/star1.png'
import Skeleton from 'antd/es/skeleton'
import { getProfilesRequest } from '~/api/lens/profile/get-profiles'
import Empty from 'antd/es/empty'
import { getExtendProfile } from '~/hooks/profile'
import { BoothUser, PlatformType, getBoothUsers } from '~/api/booth/booth'
import { getOtherUserProfile } from '~/api/go/account'
import type { CelebrityType } from './CelebrityCard'
import CelebrityCard from './CelebrityCard'
import type { Creator, ProfileExtend } from '~/lib/types/app'
import { Profile } from '~/api/lens/graphql/generated'

const HotCelebrities = (props: { searchWord: string }) => {
  const { searchWord } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [celebrities, setCelebrities] = useState([] as CelebrityType[])
  const [cacheCelebrities, setCacheCelebrities] = useState([] as CelebrityType[])

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
      if (!response) return

      const baseAddressesArray = response.map(boothUser => boothUser.baseAddress)
      const baseAddressesSet = new Set(baseAddressesArray)
      const baseAddresses = Array.from(baseAddressesSet) // 去重后的地址

      // 根据去重的地址整理展示的Celebrity List
      const boothUsersArray = [] as CelebrityType[]
      baseAddresses.forEach(baseAddress => {
        // all results of an address
        const results = response.filter(boothUser => boothUser.baseAddress === baseAddress)
        const param = {} as CelebrityType
        // TODO: 问题在于同一个地址，同一个lens,不同deschool身份的覆盖
        results.forEach(user => {
          if (user.platform === PlatformType.DESCHOOL) {
            Object.assign(param, {
              deschool: {
                username: '',
                address: user.baseAddress,
                avatar: '',
                bio: '',
              },
            })
          } else if (user.platform === PlatformType.LENS) {
            Object.assign(param, {
              lens: {
                name: '',
                ownedBy: user.address,
                avatarUrl: '',
                handle: user.lensHandle,
                bio: '',
              },
            })
          }
        })
        if (JSON.stringify(param) !== '{}') boothUsersArray.push(param)
      })

      // 查所有 lens 用户信息
      const lensUsers = boothUsersArray.filter(user => user.lens?.handle)
      const lensUsersProfiles: any = await getProfilesRequest({
        handles: lensUsers.map((lensUser: CelebrityType) => lensUser.lens.handle),
      })
      /* loop over profiles, create properly formatted ipfs image links */
      const lensProfilesData: (ProfileExtend | null)[] = lensUsersProfiles?.items
        ? lensUsersProfiles.items.map((profileInfo: any) => ({
            ...getExtendProfile(profileInfo),
          }))
        : []

      // 查所有 deschool 用户信息
      const deschoolUsers = boothUsersArray.filter(user => user.deschool?.address)
      const deschoolProfilesData: (Creator | null)[] = await Promise.all(
        deschoolUsers.map(async (deschoolInfo: CelebrityType) => getOtherUserProfile(deschoolInfo.deschool.address)),
      )

      // 合并 lens 同地址
      lensProfilesData.forEach(lensProfile => {
        const index = boothUsersArray.findIndex(boothUser => boothUser.lens?.handle === lensProfile?.handle)
        if (index > -1) {
          boothUsersArray[index].lens.name = lensProfile?.name || ''
          boothUsersArray[index].lens.avatarUrl = lensProfile?.avatarUrl || ''
          boothUsersArray[index].lens.bio = lensProfile?.bio || ''
        }
      })

      // 合并 deschool 同地址
      deschoolProfilesData.forEach(deschoolProfile => {
        const index = boothUsersArray.findIndex(boothUser => boothUser.deschool?.address === deschoolProfile?.address)
        if (index > -1) {
          boothUsersArray[index].deschool.username = deschoolProfile?.username || ''
          boothUsersArray[index].deschool.avatar = deschoolProfile?.avatar || ''
          boothUsersArray[index].deschool.bio = deschoolProfile?.bio || ''
        }
      })

      setCelebrities(boothUsersArray)
      setCacheCelebrities(boothUsersArray)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initSeries()
  }, [])

  useEffect(() => {
    setCelebrities(
      cacheCelebrities.filter(
        c =>
          c.lens?.handle?.includes(searchWord) ||
          c.lens?.name?.includes(searchWord) ||
          c.lens?.ownedBy?.includes(searchWord) ||
          c.deschool?.address?.includes(searchWord) ||
          c.deschool?.username?.includes(searchWord),
      ),
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
