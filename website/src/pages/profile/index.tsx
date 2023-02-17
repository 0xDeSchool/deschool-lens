/**
 * @description 用户个人中心Page，包括个人空间和他人空间
 * @author victor
 * @exports {UserProfile}
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'

import { useAccount } from '~/context/account'
import { useLayout } from '~/context/layout'

import { getAddress } from '~/auth/user'
import { getLanguage } from '~/utils/language'

import UserCard from './userCard'

type Tab = {
  key: string
  path: string
  name: string
}

const UserProfile = () => {
  const { address } = useParams()
  const user = useAccount()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location = useLocation()

  const { setConnectBoardVisible } = useLayout()
  const [tabs, setTabs] = useState<Tab[]>([] as Tab[])
  const [visitCase, setVisitCase] = useState<0 | 1 | -1>(-1) // 0-自己访问自己 1-自己访问别人 -1-没登录访问自己

  // 初始化登录场景
  const initCase = () => {
    let primaryCase = -1
    const cacheAddress = getAddress()

    // 有路由参数并且不等于自己地址，即访问他人的空间（不管是否登录都可以看他人空间）
    if (address && address !== cacheAddress) {
      primaryCase = 1
      setVisitCase(1)
      setConnectBoardVisible(false)
    }
    // 没有路由参数并且有缓存自己地址, 访问自己空间
    else if (!address && cacheAddress) {
      primaryCase = 0
      setVisitCase(0)
      setConnectBoardVisible(false)
    }
    // 地址栏和缓存都没有地址，既不是访问他人空间也不是访问自己，需要登录访问自己
    else {
      primaryCase = -1
      setConnectBoardVisible(true)
    }
    return primaryCase
  }

  // 初始化tab页标签
  const initTabs = (primaryCase: number) => {
    const tempTabs = [
      {
        key: '1',
        path: `/profile/${address ? `${address}/` : ''}suggested`,
        name: t('profile.suggested'),
      },
      {
        key: '2',
        path: `/profile/${address ? `${address}/` : ''}resume`,
        name: t('profile.resume'),
      },
      {
        key: '3',
        path: `/profile/${address ? `${address}/` : ''}verified`,
        name: t('profile.verified'),
      },
      // {
      //   key: '4',
      //   path: `/profile/${address ? `${address}/` : ''}activities`,
      //   name: t('profile.activities'),
      // },
    ]
    if (primaryCase === 1) {
      setTabs(tempTabs.slice(0, 2))
    } else {
      setTabs(tempTabs)
    }
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

  useEffect(() => {
    const primaryCase = initCase()

    if (primaryCase > -1) {
      initTabs(primaryCase)
      initRightTab()
    }
  }, [user, address, getLanguage()])

  return (
    <div className="relative screen-fit mx-10 space-x-10 frs-center h-full overflow-auto scroll-hidden">
      <div className="sticky w-400px top-30px left-6">
        {/* 用戶面板信息從路由來或者自己緩存來 */}
        <UserCard visitCase={visitCase} address={address} />
      </div>
      <div className="flex-1 relative font-ArchivoNarrow">
        {!location.pathname.includes('/profile/match') && (
          <div
            className="sticky top-0 left-0 pl-6 w-auto h-80px frc-start space-x-10 bg-#fafafaaa"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            {tabs.map(tab => (
              <Link key={tab.key} to={tab.path}>
                {tab.name}
              </Link>
            ))}
          </div>
        )}
        <div className="mt-30px mb-10 overflow-auto p-6 border shadow-md rounded-xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserProfile
