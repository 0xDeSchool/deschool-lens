/**
 * @description 用户相关信息的展示
 * @author victor
 * @exports {UserInfo}
 * @props
 */
import Image from 'antd/es/image'
import Skeleton from 'antd/es/skeleton'
import { useEffect, useState } from 'react'
import { getUserContext, DEFAULT_AVATAR, useAccount } from '~/context/account'
import { getExtendProfile } from '~/hooks/profile'
import { getAddress } from '~/auth/user'
// import { getProfileRequest } from '~/api/lens/profile/get-profile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import fallbackImage from '~/assets/images/fallbackImage'
import Empty from 'antd/es/empty'
import type { ProfileExtend } from '~/lib/types/app'

type UserCardProps = {
  otherUser?: ProfileExtend
  otherloading: boolean
  address: string | undefined
}

const UserCard = (props: UserCardProps) => {
  const { otherUser, otherloading, address } = props
  const { t } = useTranslation()
  const user = useAccount()
  const userContext = getUserContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const initUserInfo = async () => {
    setLoading(true)
    try {
      const addr = getAddress()
      if (addr) {
        const userInfo = await userContext.fetchUserInfo(addr)
        // const userInfo = await getProfileRequest({ handle: 'kcchen.lens' })
        if (userInfo) userContext.changeUser({ ...userInfo })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!address) {
      initUserInfo()
    } else {
      setLoading(false)
    }
  }, [address])

  let currentUser: ProfileExtend | undefined
  if (!address) {
    currentUser = getExtendProfile(user)
  } else {
    currentUser = otherUser
  }

  const handleJumpFollowers = () => {
    // 拿路由参数other或者本地参数
    navigate(`/profile/${address || getAddress()}/followers`)
  }
  const handleJumpFollowing = () => {
    navigate(`/profile/${address || getAddress()}/following`)
  }

  return loading ? (
    <Skeleton />
  ) : (
    <div className={`w-full border shadow-md rounded-xl ${otherloading ? 'hidden' : ''}`}>
      <div className="relative w-full frc-center">
        {currentUser?.coverUrl ? (
          <Image
            preview={false}
            src={currentUser.coverUrl}
            fallback={fallbackImage}
            alt="cover"
            className="w-full h-full rounded-t-xl object-contain object-center"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-140px bg-gray-3 rounded-t-xl"> </div>
        )}
        {currentUser?.avatarUrl ? (
          <Image
            preview={false}
            src={currentUser?.avatarUrl}
            fallback={DEFAULT_AVATAR}
            alt="avatar"
            style={{ width: 80, height: 80 }}
            className="rounded-full border border-4 border-white shadow-lg"
            wrapperClassName="absolute bottom--40px fcc-center w-full"
            crossOrigin="anonymous"
          />
        ) : (
          <Image
            preview={false}
            src={DEFAULT_AVATAR}
            alt="avatar"
            style={{ width: 80, height: 80 }}
            className="rounded-full border border-4 border-white shadow-lg"
            wrapperClassName="absolute bottom--40px fcc-center w-full"
          />
        )}
      </div>
      {/* 处理数据为空的情况 */}
      {currentUser?.handle ? (
        <>
          <div className="mt-70px w-full px-6 pb-6 fcc-center">
            <span className="text-xl">{currentUser?.name}</span>
            <span className="text-xl text-gray-5 font-ArchivoNarrow">@{currentUser?.handle}</span>
          </div>
          <div className="mx-10 frc-center flex-wrap">
            <a
              className="text-xl mr-4 hover:underline hover:cursor-pointer"
              onClick={() => {
                handleJumpFollowers()
              }}
            >
              <span className="text-black">{currentUser?.stats?.totalFollowers} </span>
              <span className="text-gray-5 font-ArchivoNarrow">{t('profile.followers')}</span>
            </a>
            <a
              className="text-xl hover:underline hover:cursor-pointer"
              onClick={() => {
                handleJumpFollowing()
              }}
            >
              <span className="text-black">{currentUser?.stats?.totalFollowing} </span>
              <span className="text-gray-5 font-ArchivoNarrow">{t('profile.following')}</span>
            </a>
          </div>
          <p className="m-10 text-xl line-wrap three-line-wrap">{currentUser?.bio}</p>
          {address && address !== getAddress() && (
            <div className="m-10">
              <button type="button" className="purple-border-button px-2 py-1">
                {currentUser?.isFollowedByMe ? t('UnFollow') : t('Follow')}
              </button>
            </div>
          )}
        </>
      ) : (
        <Empty className='mt-70px w-full px-6 pb-6 fcc-center'/>
      )}
    </div>
  )
}

export default UserCard
