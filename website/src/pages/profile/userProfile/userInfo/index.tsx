/**
 * @description 用户相关信息的展示
 * @author victor
 * @exports {UserInfo}
 * @props
 */
import Image from 'antd/es/image'
import Skeleton from 'antd/es/skeleton'
import { useEffect, useState } from 'react'

import type { Profile } from '~/api/lens/graphql/generated'
import { getUserContext, DEFAULT_AVATAR, useAccount } from '~/context/account'
import { getWallet } from '~/wallet'

const UserInfoComponent = (props: { otherUser?: Profile; otherloading: boolean; userId: string | undefined }) => {
  const { otherUser, otherloading, userId } = props
  const user = useAccount()
  const userContext = getUserContext()
  const [loading, setLoading] = useState(true)

  const initUserInfo = async () => {
    setLoading(true)
    try {
      const addr = await getWallet().getAddress()
      if (addr) {
        const userInfo = await userContext.fetchUserInfo(addr)
        if (userInfo) userContext.changeUser({ ...userInfo })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) {
      initUserInfo()
    } else {
      setLoading(false)
    }
  }, [userId])

  const currentUser = !userId ? user : otherUser
  return (
    <div className={`flex flex-col my-4 pb-4 relative ${otherloading ? 'hidden' : ''}`}>
      {/* 个人信息 */}
      {loading ? (
        <Skeleton className="mt-4" />
      ) : (
        <div className="flex flex-row h-fit">
          <Image
            // eslint-disable-next-line no-nested-ternary
            src={currentUser?.picture?.__typename === 'MediaSet' ? currentUser.picture.original.url : DEFAULT_AVATAR}
            alt="avatar"
            style={{ width: 100, height: 100 }}
            className="rounded-full"
            crossOrigin="anonymous"
          />
          <div className="frc-start flex-1 overflow-hidden ml-4">
            <div>
              <div className="flex flex-row items-center my-4 flex-1 overflow-hidden">
                <span className="text-3xl font-TM line-wrap one-line-wrap max-w-300px">{currentUser?.name}</span>
              </div>
              <span className="text-xl font-TM">{currentUser?.bio}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserInfoComponent
