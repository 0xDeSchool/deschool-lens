/*
 * @description: 顶部路由导航与用户信息栏
 * @author: fc && grass
 */
import type { Ref } from 'react'
import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
// import addToNetwork from '~/hooks/useAddToNetwork'

import { useTranslation } from 'react-i18next'
import { DownSquareOutlined, LoadingOutlined, MenuOutlined } from '@ant-design/icons'
import DeschoolLogoDark from '~/assets/logos/logo-main.png'
import { UserlaneIcon, ArrowDownIcon } from '~/components/icon'
import Image from 'antd/es/image'
import Avatar from 'antd/es/avatar'
import Drawer from 'antd/es/drawer'
import message from 'antd/es/message'
// import notification from 'antd/es/notification'
import TourStep from 'antd/es/tour'
import type { TourStepProps } from 'antd/es/tour/interface'

import type { UserInfoStruct } from '~/context/account'
import { getUserContext, useAccount } from '~/context/account'
import { useLayout } from '~/context/layout'
import { getNonceByUserAddress, postNonceSigByUserAddress, deleteJwtByUserAddress } from '~/api/user'
import { changeLanguage, getLanguage } from '~/utils/language'
import './userbar.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import WrapAuth from '~/components/wrapAuth'
import { initAccess } from '~/hooks/access'
import type { WalletConfig } from '~/wallet'
import { createProvider, getWallet, WalletType } from '~/wallet'
import ExploreSearchBoard from './exploreSearchBoard'

// const EXPECT_CHAINID = import.meta.env.VITE_APP_CHAIN

// function clearAllCookie() {
//   var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
//   if (keys) {
//     for (var i = keys.length; i--; ) document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
//   }
// }

const UserBar = forwardRef(
  (props: { walletConfig?: WalletConfig }, ref: Ref<{ handleConnect: (e: React.MouseEvent<HTMLButtonElement> | undefined) => void }>) => {
    const { theme, currentWidth, setTheme, setConnectBoardVisible } = useLayout()
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

    // 引导修改用户名和头像
    const refProfile = useRef(null)
    const refConfig = useRef(null)
    const [open, setOpen] = useState<boolean>(false)
    const steps: TourStepProps[] = [
      {
        title: '个人信息修改指引',
        description: '您好，新朋友，欢迎来到Deschool，下面请按界面引导，初始化您的个人信息吧~',
        placement: 'leftTop',
        target: () => refConfig.current,
        prevButtonProps: { children: null },
        nextButtonProps: { children: t('newUserGuild.next') },
      },
      {
        title: '个人信息修改指引',
        description: '点击进入个人中心',
        placement: 'leftBottom',
        target: () => refProfile.current,
        prevButtonProps: { children: t('newUserGuild.previous') },
        nextButtonProps: { children: t('newUserGuild.click') },
      },
    ]

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
      // {
      //   path: '/roadmap',
      //   name: t('roadmap')
      // },
      {
        path: '/community',
        name: t('community'),
        eventName: 'menu_click_nav_community',
      },
      {
        path: '/whitepaper',
        name: t('whitepaper'),
        eventName: 'menu_click_nav_whitepaper',
      },
    ]

    const handleFinished = () => {
      navigate('/profile', { replace: true })
    }

    // 退出登录
    const disconnect = async () => {
      try {
        const res: any = await deleteJwtByUserAddress()
        if (res?.success) {
          userContext.disconnect()
          navigate('/explore')
          window.location.reload()
        } else {
          message.error(res.message)
        }
      } catch (error: any) {
        message.error(error?.message ? error.message : '退出登录失败')
      }
    }

    // switch开关切换时切换主题颜色
    // const changeTheme = (e: React.MouseEvent<HTMLElement>) => {
    //   e.preventDefault()

    //   if (theme === 'light') {
    //     document.getElementsByTagName('html')[0].classList.add('dark')
    //     localStorage.theme = 'dark'
    //     setTheme('dark')
    //   } else {
    //     document.getElementsByTagName('html')[0].classList.remove('dark')
    //     localStorage.theme = 'light'
    //     setTheme('light')
    //   }
    // }

    // 默认浅色背景
    const init = useCallback(() => {
      if (!document.getElementsByTagName('html')[0].classList.contains('light') || !(window.localStorage.theme === 'light')) {
        document.getElementsByTagName('html')[0].classList.add('light')
        localStorage.theme = 'light'
        setTheme('light')
      } else {
        document.getElementsByTagName('html')[0].classList.add('dark')
        localStorage.theme = 'dark'
        setTheme('dark')
      }
      const s = `/${window.location.href.split('/')[3]}`
      if (s === '/landing') {
        setActiveNav('/landing')
      } else if (s === '/explore') {
        setActiveNav('/explore')
      } else {
        setActiveNav(s)
      }
    }, [setTheme, setActiveNav])

    // 初始化主题色
    useEffect(() => {
      init()
    }, [])

    // 根据路由激活导航样式
    useEffect(() => {
      if (location.pathname.startsWith('/explore')) {
        setActiveNav('/explore')
        setShowExploreSearch(true)
      } else if (location.pathname.includes('/landing')) {
        setActiveNav('/landing')
        setShowExploreSearch(false)
      } else {
        const s = location.pathname.split('/')
        setActiveNav(`/${s[1]}`)
        setShowExploreSearch(false)
      }
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

    const showDrawer = () => {
      setVisible(true)
    }

    const onClose = () => {
      setVisible(false)
    }

    /**
     * @description 连接失败的异常处理
     * @param {}
     * @returns {}
     */
    const handleFailToConnect = (err: any) => {
      let msg = ''
      if (err?.code) {
        msg = err.code
        message.error(t(`${err.code}`))
      } else {
        msg = err?.toString() || err
        message.error(msg)
      }
    }

    const handleToggleMenu = (value?: boolean) => {
      setUserMenu(value || !isShowUserMenu)
    }

    const handleStepChange = (value: number) => {
      if (value === 1) {
        handleToggleMenu(true)
      }
    }

    // const getTourData = async (address: string) => {
    //   if (address) {
    //     const result: any = await getUserCustomData({
    //       key: 'hasTourGuild',
    //     })
    //     if (!result) {
    //       setOpen(true)
    //     }
    //   }
    // }

    const handleConnect = async (e: React.MouseEvent<HTMLButtonElement> | undefined) => {
      e?.preventDefault()
      setIsLoading(true)
      try {
        const wallet = getWallet()
        const address = await wallet.getAddress()
        if (address) {
          const nonceRes: any = await getNonceByUserAddress({ address })
          if (!nonceRes.success) {
            throw nonceRes.error
          }
          const { nonce } = nonceRes
          const FIX_FORMAT_MESSAGE = `DeSchool is kindly requesting to Sign in with ${wallet.type} securely, with nonce: ${nonce}. Sign and login now, begin your journey to DeSchool!`
          const loginSig = await wallet.signMessage(FIX_FORMAT_MESSAGE)

          const validationRes: any = await postNonceSigByUserAddress({
            address,
            sig: loginSig,
            walletType: wallet.type!,
          })

          if (validationRes) {
            let userInfo = await userContext.fetchUserInfo(validationRes.address, validationRes.jwtToken)
            if (!userInfo) {
              userInfo = user
            }
            userContext.changeUser({ ...userInfo, firstConnected: true })
          }
          // await initAccess()
          // await getTourData(validationRes?.address)
          // setIsLoading(false)
          // setUserMenu(false)
        }
      } catch (err: any) {
        handleFailToConnect(err)
        setIsLoading(false)
      }
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
        let userInfo: UserInfoStruct | null = null
        if (addr) {
          userInfo = await userContext.fetchUserInfo(addr)
        }
        if (userInfo == null) {
          userInfo = user
        }
        userContext.changeUser({ ...userInfo, firstConnected: true })
        await initAccess()
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

    useImperativeHandle(ref, () => ({
      handleConnect,
      disconnect,
    }))

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
                    className={`mt-8 flex-1 flex ${currentWidth <= 768 ? 'flex-col items-start justify-center' : 'flex-row'} text-black`}
                  >
                    {navs.map((nav, index) =>
                      nav.name === t('community') || nav.name === t('whitepaper') ? (
                        <span
                          key={index.toString() + nav.name}
                          className={`cursor-not-allowed opacity-50 text-2xl text-black text-left font-ArchivoNarrow mr-10 ${
                            currentWidth <= 768 ? 'mt-4' : ''
                          }`}
                        >
                          {nav.name}
                        </span>
                      ) : (
                        <span
                          key={index.toString() + nav.name}
                          className={`cursor-pointer text-2xl text-black font-ArchivoNarrow mr-10 ${currentWidth <= 768 ? 'mt-4' : ''} ${
                            activeNav === nav.path ? 'border-b-2 border-#6525FF' : ''
                          }`}
                        >
                          <NavLink to={nav.path}>{nav.name}</NavLink>
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </Drawer>
            </div>
          ) : (
            <div className="flex-1 flex flex-row items-center justify-center col-span-6 space-x-5 h-8 leading-8 text-black">
              {navs.map((nav, index) =>
                nav.name === t('community') || nav.name === t('whitepaper') ? (
                  <span
                    key={index.toString() + nav.name}
                    className={`cursor-not-allowed opacity-50 text-2xl text-black font-ArchivoNarrow ${currentWidth <= 768 ? 'mt-4' : ''}`}
                  >
                    {nav.name}
                  </span>
                ) : (
                  <span
                    key={index.toString() + nav.name}
                    className={`cursor-pointer text-2xl font-ArchivoNarrow text-black ${
                      activeNav === nav.path ? 'border-b-2 border-#6525FF' : ''
                    }`}
                  >
                    <NavLink to={nav.path}>{nav.name}</NavLink>
                  </span>
                ),
              )}
            </div>
          )}
          {showExploreSearch && (
            <div className="mr-8">
              <ExploreSearchBoard />
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
              {user.id ? (
                <Avatar size={26} alt="user avatar" src={user.avatar} style={{ display: 'inline-block' }} />
              ) : (
                <UserlaneIcon style={{ width: '22px', height: '22px', color: '#000000' }} />
              )}
              <div className="flex flex-col items-center ml-2">
                <span className="dark:text-primary-light font-ArchivoNarrow">
                  {user.address &&
                    `${user.username === user.address ? `${user.address.slice(0, 5)}…${user.address.slice(38, 42)}` : user.username}`}
                  {!user.address && isLoading && (
                    <LoadingOutlined style={{ width: 20, height: 20, fontSize: 20 }} color="#000" className="margin-right-10" />
                  )}
                  {!user.address && !isLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        // handleConnect(e)
                        handleLogin()
                      }}
                      className="text-black font-ArchivoNarrow"
                    >
                      {t('Connect Wallet')}
                    </button>
                  )}
                </span>
              </div>
              {user.id ? (
                <div className="flex flex-col items-center relative">
                  <DownSquareOutlined
                    className={`transition-transform ${isShowUserMenu ? 'transform rotate-180' : ''} cursor-pointer ml-2`}
                    onClick={() => {
                      handleToggleMenu()
                    }}
                    ref={refConfig}
                  />
                  <ul
                    onBlur={e => {
                      handleClickAway(e)
                    }}
                    className={`usermenu rounded-md text-center mt-8 mr-40 font-ArchivoNarrow ${user.id ? 'p-6' : 'hidden'} ${
                      isShowUserMenu
                        ? 'fixed z-50 transition-height h-auto dark:bg-secondary-dark'
                        : 'fixed z-50 transition-height h-0 hidden'
                    }`}
                  >
                    <li className="w-[150px] cursor-pointer text-2xl mb-6 uppercase hover:text-purple-400">
                      <NavLink
                        to="/profile"
                        ref={refProfile}
                        className={`${activeNav === '/profile' ? 'border-b-2 border-#6525FF' : ''}`}
                      >
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
              <TourStep open={open} onClose={() => setOpen(false)} steps={steps} onChange={handleStepChange} onFinish={handleFinished} />
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export default UserBar
