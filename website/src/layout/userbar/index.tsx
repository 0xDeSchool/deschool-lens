/*
 * @description: 顶部路由导航与用户信息栏
 * @author: fc
 */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuOutlined } from '@ant-design/icons'
import Drawer from 'antd/es/drawer'
import { useLayout } from '~/context/layout'
import './userbar.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../logo'
import SwitchLanguage from './SwitchLanguage'
import WalletConnectBoard from './WalletConnectBoard'

const UserBar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentWidth } = useLayout()
  const [visible, setVisible] = useState(false) // 控制抽屉是否显示
  const [activeNav, setActiveNav] = useState('/landing') // 当前激活的路由

  const navs = [
    {
      path: '/landing',
      name: t('home'),
    },
    {
      path: '/plaza',
      name: t('plazaNav'),
    },
    {
      path: '/profile/match',
      name: t('matchNav'),
    },
    {
      path: '/learntogether',
      name: t('learnTogetherNav'),
    },
  ]

  const updateNavStatus = () => {
    if (location.pathname.includes('/plaza')) {
      setActiveNav('/plaza')
    } else if (location.pathname.includes('/landing')) {
      setActiveNav('/landing')
    } else if (location.pathname.includes('/profile/match')) {
      setActiveNav('/profile/match')
    } else if (location.pathname.includes('/learntogether')) {
      setActiveNav('/learntogether')
    } else if (location.pathname.includes('/profile/resume')) {
      setActiveNav('/profile/resume')
    } else {
      const s = location.pathname.split('/')
      setActiveNav(`/${s[3]}`)
    }
  }

  // 根据路由激活导航样式
  useEffect(() => {
    updateNavStatus()
  }, [location])

  // 用于自适应展示导航抽屉
  const showDrawer = () => {
    setVisible(true)
  }

  // 关闭抽屉
  const onClose = () => {
    setVisible(false)
  }

  return (
    <div className="select-none fixed z-4 w-full bg-#FFFFFF8A border-b-1px border-#1818180F" style={{ backdropFilter: 'blur(12px)' }}>
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
                  <SwitchLanguage />
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
                        activeNav === nav.path ? 'nav-button-active text-#774FF8' : 'nav-button-normal border-white text-#181818D9'
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
                <div
                  key={index.toString() + nav.name}
                  className={`cursor-pointer text-2xl font-ArchivoNarrow ${
                    activeNav === nav.path ? 'nav-button-active text-#774FF8' : 'nav-button-normal border-white text-#181818D9'
                  }`}
                  onClick={() => navigate(nav.path)}
                >
                  {nav.name}
                </div>
              ))}
            </div>
            <span
              className={`cursor-pointer uppercase text-2xl font-ArchivoNarrow ${
                activeNav === '/profile/resume' ? 'nav-button-active text-#774FF8' : 'nav-button-normal border-white text-#181818D9'
              }`}
              onClick={() => navigate('/profile/resume')}
            >
              {t('profile.resume')}
            </span>
          </div>
        )}
        {/* language switch */}
        <SwitchLanguage/>
        {/* wallet connect */}
        <WalletConnectBoard />
      </div>
    </div>
  )
}

export default UserBar
