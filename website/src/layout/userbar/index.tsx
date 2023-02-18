/*
 * @description: 顶部路由导航与用户信息栏
 * @author: fc
 */
import React, { useState, useEffect } from 'react'
// import addToNetwork from '~/hooks/useAddToNetwork'
import { useTranslation } from 'react-i18next'
import { MenuOutlined } from '@ant-design/icons'
import { ArrowDownIcon } from '~/components/icon'
import Drawer from 'antd/es/drawer'
import message from 'antd/es/message'
import Lens from '~/assets/icons/lens.svg'
import Deschool from '~/assets/icons/deschool.svg'
import { DEFAULT_AVATAR, getUserContext, useAccount } from '~/context/account'
import { useLayout } from '~/context/layout'
import { changeLanguage, getLanguage } from '~/utils/language'
import './userbar.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { initAccess } from '~/hooks/access'
import type { WalletConfig } from '~/wallet'
import { createProvider, getWallet, WalletType } from '~/wallet'
import { RoleType } from '~/lib/enum'
import { getCachedToken, setLensToken } from '~/auth/user'
import { fetchUserDefaultProfile } from '~/hooks/profile'
import Logo from '../logo'
import type { ProfileExtend } from '~/lib/types/app'

// const EXPECT_CHAINID = import.meta.env.VITE_APP_CHAIN

// function clearAllCookie() {
//   var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
//   if (keys) {
//     for (var i = keys.length; i--; ) document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
//   }
// }

const UserBar = (props: { walletConfig?: WalletConfig; setIsLoading: Function; isLoading: boolean }) => {
  const { walletConfig, setIsLoading, isLoading } = props
  const { currentWidth, setConnectLensBoardVisible, setConnectDeschoolBoardVisible } = useLayout()
  const { t, i18n } = useTranslation()
  const user = useAccount()
  const userContext = getUserContext()
  const [visible, setVisible] = useState(false) // 控制抽屉是否显示
  const [activeNav, setActiveNav] = useState('/landing') // 当前激活的路由
  const [isShowUserMenu, setUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navs = [
    {
      path: '/landing',
      name: t('home'),
    },
    {
      path: '/explore',
      name: t('exploreNav'),
    },
    {
      path: '/profile/match',
      name: t('matchNav'),
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
    } else if (location.pathname.includes('/landing')) {
      setActiveNav('/landing')
    } else {
      const s = location.pathname.split('/')
      setActiveNav(`/${s[3]}`)
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
        const provider = createProvider({ walletConfig, type })
        await getWallet().setProvider(type, provider)
      }

      const addr = await getWallet().getConnectedAddress()

      let userInfo: ProfileExtend | undefined
      if (addr) {
        const cacheTokenStr = getCachedToken(addr)
        if (cacheTokenStr) {
          const cacheToken = JSON.parse(cacheTokenStr)
          // TODO: refresh token?
          // const refreshResult = await refreshAuth({ refreshToken: cacheToken.refreshToken })
          // setToken(addr, refreshResult.accessToken, refreshResult.refreshToken)
          setLensToken(addr, cacheToken.accessToken, cacheToken.refreshToken)
        }
        userInfo = await fetchUserDefaultProfile(addr)
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

  const handleLoginLens = async () => {
    setConnectLensBoardVisible(true)
  }

  const handleLoginDeschool = async () => {
    setConnectDeschoolBoardVisible(true)
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
        <div style={{ width: '174px', height: '26px', lineHeight: '32px' }}>
          <NavLink to="/landing">
            <Logo />
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
                    <Logo />
                  </NavLink>
                  <div className="h-full flex flex-row items-center ml-4 cursor-pointer text-2xl text-black">
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
                        activeNav === nav.path ? 'border-b-2 border-#000000 hover:border-#00000088' : ''
                      }`}
                    >
                      <NavLink to={nav.path}>{nav.name}</NavLink>
                    </span>
                  ))}
                </div>
              </div>
            </Drawer>
          </div>
        ) : (
          <div className="flex-1 relative frc-between mr-8 col-span-6 h-8 leading-8 text-black">
            <div className="frc-center space-x-5">
              {navs.map((nav, index) => (
                <span
                  key={index.toString() + nav.name}
                  className={`cursor-pointer text-2xl font-ArchivoNarrow text-black ${
                    activeNav === nav.path ? 'border-b-2 border-#000000 hover:border-#00000088' : ''
                  }`}
                >
                  <NavLink to={nav.path}>{nav.name}</NavLink>
                </span>
              ))}
            </div>
            <span
              className={`cursor-pointer uppercase text-2xl font-ArchivoNarrow text-black ${
                activeNav === '/profile/resume' ? 'border-b-2 border-#000000 hover:border-#00000088' : ''
              }`}
            >
              <NavLink to="/profile/resume">{t('profile.resume')}</NavLink>
            </span>
          </div>
        )}
        {/* lens & deschool connect */}
        <div className="flex flex-row items-center justify-end">
          <span
            className="frc-center bg-#abfe2c rounded-xl px-4 mr-4"
            onClick={() => {
              handleLoginLens()
            }}
          >
            <img src={Lens} alt="lens" width={24} height={24} />
            <button type="button" className="text-black text-14px ml-2 font-ArchivoNarrow">
              {t('Connect Lens')}
            </button>
          </span>
          <span
            className="frc-center bg-#774ff8 rounded-xl px-4"
            onClick={() => {
              handleLoginDeschool()
            }}
          >
            <img src={Deschool} alt="lens" width={20} height={24} />
            <button type="button" className="text-white text-14px ml-2 font-ArchivoNarrow">
              {t('Connect Deschool')}
            </button>
          </span>
        </div>
        {/* language switch */}
        <div className="frc-center ml-4">
          <span
            className="font-ArchivoNarrow text-black cursor-pointer"
            onClick={e => {
              handleChange(e)
            }}
          >
            {getLanguage() === 'zh_CN' ? '中文' : 'EN'}
          </span>
          <ArrowDownIcon style={{ width: '16px', height: '16px', color: '#000000' }} />
        </div>
      </div>
    </div>
  )
}

export default UserBar
