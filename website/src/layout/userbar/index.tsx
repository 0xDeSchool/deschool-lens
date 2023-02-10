/*
 * @description: 顶部路由导航与用户信息栏
 * @author: fc
 */
import React, { useState, useEffect } from 'react'
// import addToNetwork from '~/hooks/useAddToNetwork'
import { useTranslation } from 'react-i18next'
import { DownSquareOutlined, LoadingOutlined, MenuOutlined } from '@ant-design/icons'
import DeschoolLogoDark from '~/assets/logos/logo-main.png'
import { UserlaneIcon, ArrowDownIcon } from '~/components/icon'
import Image from 'antd/es/image'
import Avatar from 'antd/es/avatar'
import Drawer from 'antd/es/drawer'
import message from 'antd/es/message'

import { DEFAULT_AVATAR, getUserContext, useAccount } from '~/context/account'
import { useLayout } from '~/context/layout'
import { changeLanguage, getLanguage } from '~/utils/language'
import './userbar.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import WrapAuth from '~/components/wrapAuth'
import { initAccess } from '~/hooks/access'
import type { WalletConfig } from '~/wallet'
import { createProvider, getWallet, WalletType } from '~/wallet'
import type { Profile } from '~/api/lens/graphql/generated'
import { RoleType } from '~/lib/enum'
import { getAddress, getCachedToken, setToken } from '~/auth/user'
import ExploreSearchBoard from './exploreSearchBoard'

// const EXPECT_CHAINID = import.meta.env.VITE_APP_CHAIN

// function clearAllCookie() {
//   var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
//   if (keys) {
//     for (var i = keys.length; i--; ) document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
//   }
// }

const UserBar = (props: { walletConfig?: WalletConfig }) => {
  const { theme, currentWidth, setConnectBoardVisible } = useLayout()
  const { t, i18n } = useTranslation()
  const user = useAccount()
  const userContext = getUserContext()
  const [visible, setVisible] = useState(false) // 控制抽屉是否显示
  const [activeNav, setActiveNav] = useState('/landing') // 当前激活的路由
  const [isLoading, setIsLoading] = useState(false)
  const [isShowUserMenu, setUserMenu] = useState(false)
  const [showExploreSearch, setShowExploreSearch] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navs = [
    {
      path: '/landing',
      name: t('home'),
      eventName: 'menu_click_nav_home',
    },
    {
      path: '/explore',
      name: t('exploreNav'),
      eventName: 'menu_click_nav_courses',
    },
  ]

  // 退出登录
  const disconnect = async () => {
    try {
      userContext.disconnect()
      navigate('/landing')
      window.location.reload()
    } catch (error: any) {
      message.error(error?.message ? error.message : '退出登录失败')
    }
  }

  const updateNavStatus = () => {
    if (location.pathname.startsWith('/explore')) {
      setActiveNav('/explore')
      setShowExploreSearch(true)
    } else if (location.pathname.includes('/landing')) {
      setActiveNav('/landing')
      setShowExploreSearch(false)
    } else {
      const s = location.pathname.split('/')
      setActiveNav(`/${s[3]}`)
      setShowExploreSearch(false)
    }
  }

  // 根据路由激活导航样式
  useEffect(() => {
    updateNavStatus()
  }, [location])

  const handleChange = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    if (i18n.language === 'en_US') {
      changeLanguage('zh_CN')
      i18n.changeLanguage('zh_CN')
    } else {
      changeLanguage('en_US')
      i18n.changeLanguage('en_US')
    }
  }

  // 用于自适应展示导航抽屉
  const showDrawer = () => {
    setVisible(true)
  }

  // 关闭抽屉
  const onClose = () => {
    setVisible(false)
  }

  /**
   * @description 控制用户登录以后的下拉菜单
   */
  const handleToggleMenu = (value?: boolean) => {
    setUserMenu(value || !isShowUserMenu)
  }

  // 初始化用户信息
  const initUserInfo = async () => {
    try {
      setIsLoading(true)
      const type: WalletType = (localStorage.getItem('WallatType') as WalletType) || WalletType.None
      if (type !== WalletType.None) {
        const provider = createProvider({ ...props.walletConfig, type })
        await getWallet().setProvider(type, provider)
      }

      const addr = await getWallet().getConnectedAddress()
      let userInfo: Profile | undefined
      if (addr) {
        // if has token
        const cacheTokenStr = getCachedToken(addr)
        if (cacheTokenStr) {
          const cacheToken = JSON.parse(cacheTokenStr)
          setToken(addr, cacheToken.accessToken, cacheToken.refreshToken)
        }
        userInfo = await userContext.fetchUserInfo(addr)
      }
      if (!userInfo) {
        await initAccess(RoleType.Visiter) // todo 如果登陆成功就更新用户角色，否则为游客角色
      } else {
        userContext.changeUser({ ...userInfo })
        await initAccess(RoleType.User) // todo 如果登陆成功就更新用户角色，否则为游客角色
      }
      setUserMenu(false)
    } catch (error) {
      message.error('信息初始化失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setConnectBoardVisible(true)
  }

  useEffect(() => {
    initUserInfo()
  }, [])

  const handleClickAway = (e: React.FocusEvent<HTMLUListElement>) => {
    e.preventDefault()
    setUserMenu(false)
  }
  return (
    <div className="select-none fixed z-4 w-full bg-#ffffff80" style={{ backdropFilter: 'blur(12px)' }}>
      <div className="flex flex-row items-center justify-between w-auto leading-8 py-4 px-6 xl:px-8 text-xl">
        {/* logo */}
        <div style={{ width: '174px', height: '26px' }}>
          <NavLink to="/landing">
            <Image src={theme === 'light' ? DeschoolLogoDark : DeschoolLogoDark} width="174px" height="26px" preview={false} alt="logo" />
          </NavLink>
        </div>
        {/* navs */}
        {currentWidth <= 1200 ? (
          <div className="flex-1 flex items-center justify-end pr-4">
            <MenuOutlined onClick={() => showDrawer()} />
            <Drawer
              placement={currentWidth <= 768 ? 'right' : 'top'}
              closable={false}
              onClose={onClose}
              open={visible}
              height={140}
              key={currentWidth <= 768 ? 'right' : 'top'}
            >
              <div className="flex flex-col justify-start">
                <div style={{ width: '260px', height: '26px' }} className="flex">
                  <NavLink to="/landing">
                    <Image src={theme === 'light' ? DeschoolLogoDark : DeschoolLogoDark} width="174px" height="26px" preview={false} />
                  </NavLink>
                  <div className="h-full flex flex-row items-center ml-8 cursor-pointer text-2xl text-black">
                    <span
                      className="mr-1 font-ArchivoNarrow min-w-[60px]"
                      onClick={e => {
                        handleChange(e)
                      }}
                    >
                      {getLanguage() === 'zh_CN' ? '中文' : 'EN'}
                    </span>
                    <ArrowDownIcon style={{ width: '16px', height: '16px', color: '#000000' }} className="mr-1" />
                  </div>
                </div>
                <div
                  className={`mt-8 relative flex-1 flex ${
                    currentWidth <= 768 ? 'flex-col items-start justify-center' : 'flex-row'
                  } text-black`}
                >
                  {navs.map((nav, index) => (
                    <span
                      key={index.toString() + nav.name}
                      className={`cursor-pointer text-2xl text-black font-ArchivoNarrow mr-10 ${currentWidth <= 768 ? 'mt-4' : ''} ${
                        activeNav === nav.path ? 'border-b-2 border-#6525FF' : ''
                      }`}
                    >
                      <NavLink to={nav.path}>{nav.name}</NavLink>
                    </span>
                  ))}
                  {showExploreSearch && (
                    <div className="absolute right-8">
                      <ExploreSearchBoard />
                    </div>
                  )}
                </div>
              </div>
            </Drawer>
          </div>
        ) : (
          <div className="flex-1 relative flex flex-row items-center justify-center col-span-6 space-x-5 h-8 leading-8 text-black">
            {navs.map((nav, index) => (
              <span
                key={index.toString() + nav.name}
                className={`cursor-pointer text-2xl font-ArchivoNarrow text-black ${
                  activeNav === nav.path ? 'border-b-2 border-#6525FF' : ''
                }`}
              >
                <NavLink to={nav.path}>{nav.name}</NavLink>
              </span>
            ))}
            {showExploreSearch && (
              <div className="absolute right-8">
                <ExploreSearchBoard />
              </div>
            )}
          </div>
        )}
        {/* language && userInfo */}
        <div className="flex flex-row items-center justify-end">
          {currentWidth <= 1200 ? (
            ''
          ) : (
            <div className="h-full flex flex-row items-center mr-8 cursor-pointer text-black">
              <span
                className="mr-1 font-ArchivoNarrow"
                onClick={e => {
                  handleChange(e)
                }}
              >
                {getLanguage() === 'zh_CN' ? '中文' : 'EN'}
              </span>
              <ArrowDownIcon style={{ width: '16px', height: '16px', color: '#000000' }} className="mr-1" />
            </div>
          )}
          <div className="relative flex flex-row items-center">
            {user ? (
              <Avatar
                size={26}
                alt="user avatar"
                src={user.picture?.__typename === 'MediaSet' ? user.picture.original.url : DEFAULT_AVATAR}
                style={{ display: 'inline-block' }}
              />
            ) : (
              <UserlaneIcon style={{ width: '22px', height: '22px', color: '#000000' }} />
            )}
            <div className="flex flex-col items-center ml-2">
              <span className="dark:text-primary-light font-ArchivoNarrow">
                {getAddress() && !user?.handle ? `${getAddress()?.slice(0, 5)}…${getAddress()?.slice(38, 42)}` : null}
                {user?.handle && `${user?.name === user?.handle ? `${user.handle.slice(0, 5)}…${user.handle.slice(38, 42)}` : user.name}`}
                {!user?.handle && isLoading && (
                  <LoadingOutlined style={{ width: 20, height: 20, fontSize: 20 }} color="#000" className="margin-right-10" />
                )}
                {!user?.handle && !isLoading && !getAddress() && (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogin()
                    }}
                    className="text-black font-ArchivoNarrow"
                  >
                    {t('Connect Wallet')}
                  </button>
                )}
              </span>
            </div>
            {user?.id || getAddress() ? (
              <div className="flex flex-col items-center relative">
                <DownSquareOutlined
                  className={`transition-transform ${isShowUserMenu ? 'transform rotate-180' : ''} cursor-pointer ml-2`}
                  onClick={() => {
                    handleToggleMenu()
                  }}
                />
                <ul
                  onBlur={e => {
                    handleClickAway(e)
                  }}
                  className={`usermenu rounded-md text-center mt-8 mr-40 font-ArchivoNarrow ${
                    user?.id || getAddress() ? 'p-6' : 'hidden'
                  } ${
                    isShowUserMenu
                      ? 'fixed z-50 transition-height h-auto dark:bg-secondary-dark'
                      : 'fixed z-50 transition-height h-0 hidden'
                  }`}
                >
                  <li className="w-[150px] cursor-pointer text-2xl mb-6 uppercase hover:text-purple-400">
                    <NavLink to="/profile" className={`${activeNav === '/profile' ? 'border-b-2 border-#6525FF' : ''}`}>
                      {t('profile.profile')}
                    </NavLink>
                  </li>
                  <WrapAuth>
                    <li className="block w-[150px] cursor-pointer text-2xl mb-6 uppercase hover:text-purple-400">
                      <NavLink
                        to="/manage"
                        onClick={() => setUserMenu(false)}
                        className={`${activeNav === '/manage' ? 'border-b-2 border-#6525FF' : ''}`}
                      >
                        {t('manage')}
                      </NavLink>
                    </li>
                  </WrapAuth>
                  <div className="h-[1px] w-full my-6 bg-black"> </div>
                  <li
                    className="w-[150px] cursor-pointer text-2xl uppercase text-#6525FF hover:text-[#e9d5ff]"
                    onClick={() => {
                      disconnect()
                    }}
                  >
                    {t('disconnect')}
                  </li>
                </ul>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBar
