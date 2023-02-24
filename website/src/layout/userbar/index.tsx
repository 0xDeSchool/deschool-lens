/*
 * @description: 顶部路由导航与用户信息栏
 * @author: fc
 */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import Dropdown from 'antd/es/dropdown'
import { ArrowDownIcon } from '~/components/icon'
import Drawer from 'antd/es/drawer'
import message from 'antd/es/message'
import IconLens from '~/assets/icons/lens.svg'
import IconCyberConnect from '~/assets/icons/cyberconnect.svg'
import Deschool from '~/assets/icons/deschool.svg'
import { getUserContext, useAccount } from '~/context/account'
import { useLayout } from '~/context/layout'
import { changeLanguage, getLanguage } from '~/utils/language'
import './userbar.css'
import { NavLink, useLocation } from 'react-router-dom'
import { getShortAddress } from '~/utils/format'
import Logo from '../logo'

const UserBar = () => {
  const { currentWidth,
    setConnectLensBoardVisible,
    setConnectDeschoolBoardVisible,
    setCyberConnectBoardVisible,
   } = useLayout()
  const { t, i18n } = useTranslation()
  const [visible, setVisible] = useState(false) // 控制抽屉是否显示
  const [activeNav, setActiveNav] = useState('/landing') // 当前激活的路由
  const [isShowDeschoolUserMenu, setDeschoolUserMenu] = useState(false)
  const [isShowLensUserMenu, setLensUserMenu] = useState(false)
  const [isShowCyberConnectUserMenu, setCyberConnectUserMenu] = useState(false)
  const location = useLocation()
  const { lensProfile, lensToken, cyberToken, cyberProfile, deschoolProfile } = useAccount()
  console.log('cyberProfile', cyberProfile)

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

  // 退出 Deschool 登录
  const disconnectFromDeschool = () => {
    try {
      getUserContext().disconnectFromDeschool()
      setDeschoolUserMenu(false)
    } catch (error: any) {
      message.error(error?.message ? error.message : '退出登录失败')
    }
  }

  // 退出 Lens 登录
  const disconnectFromLens = async () => {
    try {
      getUserContext().disconnectFromLens()
      setLensUserMenu(false)
    } catch (error: any) {
      message.error(error?.message ? error.message : '退出登录失败')
    }
  }

  // 退出 CyberConnect 登录
  const disconnectFromCyberConnect = async () => {
    try {
      getUserContext().disconnectFromCyberConnect()
      setCyberConnectUserMenu(false)
    } catch (error: any) {
      message.error(error?.message ? error.message : '退出登录失败')
    }
  }

  const DeschoolItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <button
          type="button"
          onClick={() => {
            disconnectFromDeschool()
          }}
        >
          Disconnect from Deschool
        </button>
      ),
    },
  ]

  const LensItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <button
          type="button"
          onClick={() => {
            disconnectFromLens()
          }}
        >
          Disconnect from Lens
        </button>
      ),
    },
  ]

  const cyberConnectItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <button
          type="button"
          onClick={() => {
            disconnectFromCyberConnect()
          }}
        >
          Disconnect from CyberConnect
        </button>
      ),
    },
  ]

  /**
   * @description 控制 Deschool 用户登录以后的下拉菜单
   */
  const handleToggleDeschoolMenu = (value?: boolean) => {
    setDeschoolUserMenu(value || !isShowDeschoolUserMenu)
  }

  /**
   * @description 控制 Lens 用户登录以后的下拉菜单
   */
  const handleToggleLensMenu = (value?: boolean) => {
    setLensUserMenu(value || !isShowLensUserMenu)
  }

  /**
   * @description 控制 CyberConnect 用户登录以后的下拉菜单
   */
  const handleToggleCyberConnectMenu = (value?: boolean) => {
    setCyberConnectUserMenu(value || !isShowCyberConnectUserMenu)
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

  const handleLoginLens = async () => {
    setConnectLensBoardVisible(true)
  }

  const handleLoginDeschool = async () => {
    setConnectDeschoolBoardVisible(true)
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
          <Dropdown menu={{ items: cyberConnectItems }} placement="bottom" trigger={['click']} open={isShowCyberConnectUserMenu}>
            <span
              className="frc-center bg-black rounded-xl px-4 mr-4"
              onClick={e => {
                e.preventDefault()
                if (cyberToken) {
                  handleToggleCyberConnectMenu()
                } else {
                  setCyberConnectBoardVisible(true)
                }
              }}
            >
              <img src={IconCyberConnect} alt="lens" width={24} height={24} />
              <button type="button" className="text-white text-14px ml-2 font-ArchivoNarrow">
                {cyberProfile ? cyberProfile?.handle : t('Connect CyberConnect')}
              </button>
            </span>
          </Dropdown>
          <Dropdown menu={{ items: LensItems }} placement="bottom" trigger={['click']} open={isShowLensUserMenu}>
            <span
              className="frc-center bg-#abfe2c rounded-xl px-4 mr-4"
              onClick={e => {
                e.preventDefault()
                if (lensToken) {
                  handleToggleLensMenu()
                } else {
                  handleLoginLens()
                }
              }}
            >
              <img src={IconLens} alt="lens" width={24} height={24} />
              <button type="button" className="text-black text-14px ml-2 font-ArchivoNarrow">
                {lensProfile ? lensProfile?.handle : t('Connect Lens')}
              </button>
            </span>
          </Dropdown>
          <Dropdown menu={{ items: DeschoolItems }} placement="bottom" trigger={['click']} open={isShowDeschoolUserMenu}>
            <span
              className="frc-center bg-#774ff8 rounded-xl px-4"
              onClick={e => {
                e.preventDefault()
                if (deschoolProfile) {
                  handleToggleDeschoolMenu()
                } else {
                  handleLoginDeschool()
                }
              }}
            >
              <img src={Deschool} alt="lens" width={20} height={24} />
              <button type="button" className="text-white text-14px ml-2 font-ArchivoNarrow">
                {deschoolProfile ? getShortAddress(deschoolProfile?.address) : t('Connect Deschool')}
              </button>
            </span>
          </Dropdown>
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
