// @ts-nocheck 忽略文件校验
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { useRef, useEffect, useState } from 'react'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import Modal from 'antd/es/modal/Modal'
import { isLogin } from '~/auth'
import { getUserContext, useAccount } from '~/context/account'
import type { WalletConfig } from '~/wallet'
import { getWallet } from '~/wallet'
import { scrollToTop } from '~/utils/common'
import ConnectBoard from '../components/connectBoard'
import Footer from './footer'
import UserBar from './userbar'

/*
 * @description: Layout
 * @author: Victor
 */
const Layout = () => {
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [curLocation, setCurLocation] = useState(location.pathname + location.search)
  const [isSwitchingUser, setIsSwitchingUser] = useState(false)
  const [pageLayout, setPageLayout] = useState('w-full')
  const [footerLayout, setFooterLayout] = useState('')

  const user = useAccount()
  const userContext = getUserContext()

  const userbarRef = useRef<ElementRef<typeof UserBar>>(null)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const getPageLayout = () => {
    let classes = 'w-full'
    let footerClasses = ''
    if (location.pathname.startsWith('/explore') || location.pathname.startsWith('/landing') || location.pathname.startsWith('/orglist')) {
      classes = 'w-full pt-0px!'
      if (location.pathname.startsWith('/explore') || location.pathname.startsWith('/orglist')) {
        footerClasses = 'w-max mx-10px lg:min-w-875px xl:min-w-1135px'
      }
    } else if (
      location.pathname.startsWith('/manage/') ||
      location.pathname.startsWith('/org') ||
      location.pathname.startsWith('/series/seriesintro') ||
      location.pathname.startsWith('/courses/course/') ||
      location.pathname.startsWith('/profile') ||
      location.pathname.startsWith('/passmint')
    ) {
      classes = 'w-full lg:w-768px xl:w-1024px 2xl:w-1135px 3xl:w-1205px' // px-10 mx-0 md:px-0 md:mx-10 md:w-5/7  4xl:w-1680px
      footerClasses = 'w-full lg:w-768px xl:w-1024px 2xl:w-1135px 3xl:w-1205px'
    }
    setPageLayout(classes)
    setFooterLayout(footerClasses)
  }

  useEffect(() => {
    getPageLayout()
    scrollToTop()
    setCurLocation(location.pathname + location.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  // 同意切换账户
  const handleOk = async () => {
    setIsSwitchingUser(true)
    try {
      const addr = await getWallet().getAddress()
      if (user.address && addr !== user.address) {
        // 如果当前在 courseLearning 页面则跳转到 home 页面
        const cachedToken = await userContext.fetchUserInfo(addr)
        if (cachedToken == null) {
          await userbarRef.current.handleConnect()
        }
        navigate('/explore')
        window.location.reload()
      }
    } finally {
      setIsSwitchingUser(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const config: WalletConfig = {
    accountChanged: (account: string) => {
      if (!isLogin()) {
        handleOk()
      } else if (account) {
        setIsModalOpen(true)
      } else {
        userContext.disconnect()
        navigate('/explore')
        window.location.reload()
      }
    },
    disconnected: () => {
      userContext.disconnect()
      navigate('/explore')
      window.location.reload()
    },
    chainChanged: chainId => {
      if (chainId === '0x89' && !isLogin()) {
        userbarRef.current.handleConnect()
        window.location.reload()
      }
    },
  }
  const [walletconfig] = useState<WalletConfig>(config)

  return (
    <div className="relative w-full h-full bg-white">
      <UserBar ref={userbarRef} walletConfig={walletconfig} />
      {user.firstConnected && (
        <div className="relative w-full h-fit min-h-full flex flex-col items-center" id="container">
          <div
            className={`flex-1 overflow-auto w-full fcc-center bg-#fafafa ${
              location.pathname.startsWith('/explore') || location.pathname.startsWith('/orglist') ? '' : 'pt-64px'
            }`}
          >
            <div className={`flex-1 overflow-auto flex flex-col ${pageLayout}`}>
              <Outlet />
            </div>
          </div>
          <Footer footerLayout={footerLayout} />
        </div>
      )}
      {/* login board */}
      <ConnectBoard wallectConfig={walletconfig} />
      <Modal
        title={<h1>{t('system.notify_title')}</h1>}
        closable={false}
        open={isModalOpen}
        onCancel={handleCancel}
        destroyOnClose
        footer={
          <div className="flex flex-row justify-start items-center">
            <button
              type="button"
              className="uppercase font-ArchivoNarrow text-center py-1 px-2 mr-2 inline-flex purple-button"
              onClick={() => {
                handleOk()
              }}
            >
              {isSwitchingUser ? <LoadingOutlined className="mr-2" /> : t('confirm.sure')}
            </button>
            <button
              type="button"
              className="uppercase font-ArchivoNarrow text-center p-2 mr-2 inline-flex items-center text-#6525FF hover:text-purple-500 hover:cursor-pointer "
              onClick={() => {
                handleCancel()
              }}
            >
              {t('cancel')}
            </button>
          </div>
        }
      >
        <p>{t('system.notify_account')}</p>
      </Modal>
    </div>
  )
}
export default Layout
