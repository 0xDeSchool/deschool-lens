// @ts-nocheck 忽略文件校验
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import Modal from 'antd/es/modal/Modal'
import { getUserContext } from '~/context/account'
import type { WalletConfig } from '~/wallet'
import { getWallet } from '~/wallet'
import { scrollToTop } from '~/utils/common'
import ConnectDeschoolBoard from '~/layout/connectDeschool'
import { RoleType } from '~/lib/enum'
import ConnectLensBoard from './connectLens'
import ConnectCyberBoard from './cyberConnect'
import Footer from './footer'
import UserBar from './userbar'

/*
 * @description: Layout
 * @author: Victor
 */
const Layout = () => {
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSwitchingUser, setIsSwitchingUser] = useState(false)
  const [pageLayout, setPageLayout] = useState('w-full')
  const [footerLayout, setFooterLayout] = useState('')
  const [connectTrigger, setConnectTrigger] = useState<number | null>(null)

  const navigate = useNavigate()
  const { t } = useTranslation()

  const getPageLayout = () => {
    const classes = 'w-full pt-0px!'
    // footerClasses = 'w-max mx-10px lg:min-w-875px xl:min-w-1135px'
    setPageLayout(classes)
    setFooterLayout('')
  }

  useEffect(() => {
    getPageLayout()
    scrollToTop()
  }, [location])

  // 同意切换账户
  const handleOk = async () => {
    setIsSwitchingUser(true)
    try {
      const addr = await getWallet().getAddress()
      // TODO: Q产品 当用户切换时 怎么办
      if (getUserContext().lensToken?.address && addr !== getUserContext().lensToken?.address) {
        const cachedToken = await fetchUserDefaultProfile(addr)
        if (cachedToken == null) {
          setIsModalOpen(false)
          setConnectTrigger(addr)
        }
      }
    } finally {
      setIsModalOpen(false)
      setIsSwitchingUser(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const config: WalletConfig = {
    accountChanged: (account: string) => {
      const role = getUserContext().getLoginRoles()
      if (role.includes(RoleType.Visitor)) {
        handleOk()
      } else if (account) {
        setIsModalOpen(true)
      } else {
        // 账户地址变则lens和deschool都受影响
        getUserContext().disconnectFromDeschool()
        getUserContext().disconnectFromLens()
        navigate('/landing')
        window.location.reload()
      }
    },
    disconnected: () => {
      getUserContext().disconnectFromDeschool()
      getUserContext().disconnectFromLens()
      navigate('/landing')
      window.location.reload()
    },
    // chainChanged: chainId => {
    //   if (chainId === '0x89' && !isLogin()) {
    //     setConnectTrigger(new Date().getTime())
    //     window.location.reload()
    //   }
    // },
  }
  const [walletconfig] = useState<WalletConfig>(config)

  return (
    <div className="relative w-full h-full bg-white">
      <UserBar />
      <div
        className={`relative w-full  ${
          location.pathname.startsWith('/profile') ? 'h-full overflow-auto' : 'h-fit min-h-full'
        } flex flex-col items-center`}
        id="container"
      >
        <div
          className={`flex-1 overflow-auto w-full fcc-center bg-#fafafa ${
            location.pathname.startsWith('/plaza') || location.pathname.startsWith('/landing') ? '' : 'pt-64px'
          }`}
        >
          <div className={`flex-1 overflow-auto flex flex-col ${pageLayout}`}>
            <Outlet />
          </div>
        </div>
        {location.pathname.startsWith('/profile') ? null : <Footer footerLayout={footerLayout} />}
      </div>
      {/* login lens board */}
      <ConnectLensBoard wallectConfig={walletconfig} connectTrigger={connectTrigger} />
      <ConnectCyberBoard />
      <ConnectDeschoolBoard />
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
