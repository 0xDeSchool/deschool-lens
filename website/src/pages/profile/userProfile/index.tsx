/**
 * @description 用户个人中心
 * @author victor
 * @exports {UserProfile}
 * @props
 */
import React, { useEffect, useState } from 'react'
import Tabs from 'antd/es/tabs'
import type { TabsProps } from 'antd'

import { useParams } from 'react-router'
import type { Profile } from '~/api/lens/graphql/generated'
import { useAccount } from '~/context/account'
import { useTranslation } from 'react-i18next'
import { getUserProfile } from '~/api/account'
import { getLanguage } from '~/utils/language'
import UserInfo from './userInfo'
import RecentSBT from './recentSBT'

// 主函数：返还个人中心组件
const UserProfile = () => {
  const { userId } = useParams()
  const user = useAccount()
  const { t } = useTranslation()
  const [otherUser, setOtherUser] = useState({} as Profile)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const defaultTab = localStorage.getItem('pfTab')
  localStorage.removeItem('pfTab')

  const getAllItems = (_otherUser: Profile) => {
    const allItems: TabsProps['items'] = [
      {
        key: '2',
        label: <h1 className="uppercase text-xl">{t('profile.posk')}</h1>,
        children: (
          <div className="min-h-300px mt-8">
            <RecentSBT address={_otherUser.handle} />
          </div>
        ),
      },
      // {
      //   key: '5',
      //   label: `L2E(Learn to Earn)`,
      //   children: <div className="min-h-300px mt-8">
      //   <RecentFeed />
      //   </div>,
      // },
    ]
    return allItems
  }

  const initOtherInfo = async () => {
    setLoading(true)
    try {
      const userInfo = await getUserProfile(userId)
      if (!userInfo) {
        // message.error('用户不存在，即将返回上一页')
        // setTimeout(() => {
        //   history.back()
        // }, 3000)
        setOtherUser({} as Profile)
      } else {
        setOtherUser(userInfo)
        setItems(getAllItems(userInfo).slice(0, 3))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 未登录查看个人中心，只显示前三个tab
    if (!user) {
      setOtherUser({} as Profile)
      setItems(getAllItems({} as Profile).slice(0, 3))
    }
    // 如果是别人的个人中心，只显示前三个tab
    else if (userId && user?.id !== userId) {
      initOtherInfo()
    }
    // 如果是自己的个人中心，显示全部tab
    else {
      setOtherUser({} as Profile)
      setItems(getAllItems(user as Profile).slice())
    }
  }, [userId, getLanguage()])

  return (
    <div className="w-full flex flex-row items-center justify-center">
      <div className="relative w-full flex scroll-hidden flex-col max-w-1200px text-base">
        <div className="font-Anton w-full py-24px mb-12px flex items-center justify-between text-black border-b border-#00000014">
          <div className="ml-4 flex flex-row items-center text-40px leading-60px">{t('profile.profile')}</div>
        </div>
        <UserInfo otherUser={otherUser} userId={userId} otherloading={loading} />
        <div className="profile-down bg-#1818180a h-fit py-6 px-8 rounded-6">
          {/* 导航 */}
          <Tabs defaultActiveKey={defaultTab || '1'} items={items} tabBarGutter={40} />
        </div>
      </div>
    </div>
  )
}

export default UserProfile
