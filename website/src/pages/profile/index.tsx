/**
 * @description 用户个人中心
 * @author victor
 * @exports {UserProfile}
 * @props
 */
import React, { useEffect, useState } from 'react'

import { Outlet, useNavigate, useParams } from 'react-router'
import type { Profile } from '~/api/lens/graphql/generated'
// import { useTranslation } from 'react-i18next'
import { getDefaultProfileRequest } from '~/api/lens/profile/get-default-profile'
import { useAccount } from '~/context/account'
import { getAddress } from '~/auth/user'
import { useLayout } from '~/context/layout'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getLanguage } from '~/utils/language'
import UserInfo from './userCard'

type Tab = {
  key: string
  path: string
  name: string
}

// 个人中心Page
const UserProfile = () => {
  const { address } = useParams()
  const user = useAccount()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [otherUser, setOtherUser] = useState({} as Profile)
  const [otherloading, setOtherLoading] = useState(true)
  const { setConnectBoardVisible } = useLayout()
  const [tabs, setTabs] = useState<Tab[]>([] as Tab[])

  const initTabs = () => {
    const tempTabs = [
      {
        key: '1',
        path: `/profile/${address ? `${address}/` : ''}suggested`,
        name: t('profile.suggested'),
      },
      {
        key: '2',
        path: `/profile/${address ? `${address}/` : ''}activities`,
        name: t('profile.activities'),
      },
      {
        key: '3',
        path: `/profile/${address ? `${address}/` : ''}resume`,
        name: t('profile.resume'),
      },
      {
        key: '4',
        path: `/profile/${address ? `${address}/` : ''}verified`,
        name: t('profile.verified'),
      },
    ]
    setTabs(tempTabs)
  }

  // 初始化右侧的路由和内容
  const initRightTab = () => {
    // 路由存在这个参数
    if (address) {
      // 自己看自己
      if (address === getAddress()) {
        navigate('/profile/suggested')
      }
      // 自己看别人
      else {
        navigate(`/profile/${address}/suggested`)
      }
    }
    // 判断是否登录,没登录就先登录
    else if (!getAddress() || user?.handle) {
      navigate('/profile/suggested')
    } else {
      setConnectBoardVisible(true)
    }
  }

  // 初始化左侧的用户信息
  const initLeftInfo = async () => {
    setOtherLoading(true)
    try {
      const userInfo = await getDefaultProfileRequest({ ethereumAddress: address })
      if (!userInfo) {
        // message.error('用户不存在，即将返回上一页')
        // setTimeout(() => {
        //   history.back()
        // }, 3000)
        setOtherUser({} as Profile)
      } else {
        setOtherUser(userInfo)
      }
    } finally {
      setOtherLoading(false)
      initRightTab()
    }
  }

  useEffect(() => {
    initTabs()
    initLeftInfo()
  }, [address, getLanguage()])

  return (
    <div className="relative w-auto mx-10 space-x-10 frs-center h-full overflow-auto scroll-hidden">
      <div className="w-400px relative mt-30px">
        <div className="sticky top-6 left-6">
          <UserInfo address={address} otherloading={otherloading} otherUser={otherUser} />
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="sticky top-0 left-0 w-full h-80px frc-start space-x-10 bg-#fafafa" style={{ backdropFilter: 'blur(12px)' }}>
          {tabs.map(tab => (
            <Link key={tab.key} to={tab.path}>
              {tab.name}
            </Link>
          ))}
        </div>
        <div className="mb-10 overflow-auto p-6 border shadow-md rounded-xl">
          <Outlet />
        </div>
      </div>
      {/* 这里有多种情况： */}
      {/* 一、用户在看自己的 Following，此时可以显示 Unfollow 按钮。如果两人互关以文字形式写在名字旁边 */}
      {/* 二、用户在看自己的Followers，此时有 Follow 按钮用以回关，如果双向关注则显示出来，hover上去变成 Unfollow */}
      {/* 三、用户在看别人的 Following，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
      {/* 四、用户在看别人的 Follower，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
    </div>
  )
}

export default UserProfile
