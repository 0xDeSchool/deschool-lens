import MetaMaskImage from '~/assets/logos/mask.png'
import UnipassLogo from '~/assets/logos/unipass.svg'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import message from 'antd/es/message'

import { getUserContext, useAccount } from '~/context/account'
import { useLayout } from '~/context/layout'
import { getNonceByUserAddress, postNonceSigByUserAddress } from '~/api/user'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { initAccess } from '~/hooks/access'
import type { WalletConfig } from '~/wallet'
import { createProvider, getWallet, WalletType } from '~/wallet'

interface ConnectBoardProps {
  isInner?: boolean
  wallectConfig?: WalletConfig
}

const ConnectBoard: FC<ConnectBoardProps> = props => {
  const { isInner } = props
  const userContext = getUserContext()
  const { connectBoardVisible, setConnectBoardVisible } = useLayout()
  const [loading, setLoading] = useState(false)
  const [loadingUniPass, setLoadingUniPass] = useState(false)
  const [tempAddressObj, setTempAddressObj] = useState<{ type: WalletType; address: string | undefined }>({
    type: WalletType.None,
    address: undefined,
  })
  // MetaMask or UniPass
  const { t } = useTranslation()
  const user = useAccount()

  useEffect(() => {
    if (connectBoardVisible === false) {
      setTempAddressObj({
        type: WalletType.None,
        address: undefined,
      })
      setLoading(false)
      setLoadingUniPass(false)
    }
  }, [connectBoardVisible])

  /**
   * @description 连接失败的异常处理
   * @param {}
   * @returns {}
   */
  const handleFailToConnect = (err: any) => {
    if (err?.code) {
      message.error(t(`${err.code}`))
    } else {
      message.error(err?.toString() || err)
    }
    setConnectBoardVisible(false)
  }

  const signLoginMessage = async (nonce: string) => {
    const FIX_FORMAT_MESSAGE = `DeSchool is kindly requesting to Sign in with ${
      getWallet().type
    } securely, with nonce: ${nonce}. Sign and login now, begin your journey to DeSchool!`
    const signMessageReturn = await getWallet().signMessage(FIX_FORMAT_MESSAGE)
    return signMessageReturn
  }

  const handleLoginByAddress = async (address: string) => {
    try {
      const nonceRes: any = await getNonceByUserAddress({ address })
      if (!nonceRes.success) {
        throw nonceRes.error
      }
      const { nonce } = nonceRes
      const loginSig = await signLoginMessage(nonce)

      const validationRes: any = await postNonceSigByUserAddress({
        walletType: getWallet().type!,
        address,
        sig: loginSig,
      })

      if (validationRes) {
        let userInfo = await userContext.fetchUserInfo(validationRes.address, validationRes.jwtToken)
        if (!userInfo) {
          userInfo = user
        }
        userContext.changeUser({ ...userInfo, firstConnected: true })
      }
      await initAccess()
    } catch (error) {
      message.error(t('signMessageError'))
      throw error
    } finally {
      setTempAddressObj({ type: WalletType.None, address: undefined })
      setConnectBoardVisible(false)
    }
  }

  /**
   * 链接钱包
   * @returns
   */
  const handleConect = async (type: WalletType) => {
    if (tempAddressObj.address) {
      handleLoginByAddress(tempAddressObj.address)
      return
    }
    if (loadingUniPass || loading) return
    if (type === WalletType.MetaMask) {
      setLoading(true)
    } else {
      setLoadingUniPass(true)
    }
    try {
      const config = { ...props.wallectConfig, type }
      const provider = createProvider(config)
      await getWallet().setProvider(type, provider)
      const address = await getWallet().getAddress()
      if (address) {
        setTempAddressObj({
          type,
          address,
        })
      }
    } catch (err: any) {
      handleFailToConnect(err)
    } finally {
      if (type === WalletType.MetaMask) {
        setLoading(false)
      } else {
        setLoadingUniPass(false)
      }
    }
  }

  const panel = (
    <div
      className="relative bg-white flex flex-col justify-center items-center w-full p-10 rounded-lg dark:bg-#1a253b shadow dark:shadow-slate-300"
      style={{ minHeight: '24rem', maxWidth: '38rem' }}
    >
      <p className="dark:text-white text-3xl">{t('connectWallet')}</p>
      <div
        className="text-2xl text-red-300 hover:text-red-400 cursor-pointer absolute right-6 top-0"
        onClick={e => {
          e.preventDefault()
          setConnectBoardVisible(false)
        }}
      >
        <CloseOutlined className="mt-2" />
      </div>
      <div className="rounded-4 bg-gray-1 p-6 mb-6 text-16px hidden">
        <span>{t('connect_content_1')}</span>
        <span className="text-#6525FF">{t('connect_content_2')}</span>
        <span>{t('connect_content_3')}</span>
        <span>{t('connect_content_4')}</span>
        <span className="text-#6525FF">{t('connect_content_5')}</span>
      </div>
      <div className="flex flex-row w-full items-center justify-center">
        {tempAddressObj.type === WalletType.MetaMask || tempAddressObj.type === WalletType.None ? (
          <button
            onClick={e => {
              e.preventDefault()
              handleConect(WalletType.MetaMask)
            }}
            type="button"
            className="flex flex-col items-center justify-between dark:bg-#1a253b cursor-pointer w-full p-3 mb-2 rounded-md border border-solid border-#6525FF bg-white hover:border-#6525FF66 hover:bg-#6525FF22"
            disabled={loading}
            style={{ cursor: `${loading ? 'not-allowed' : ''}` }}
          >
            <div className="mb-0 text-#6525FF text-[16px] w-full frc-between">
              <div className="flex">
                <span>{tempAddressObj.type === WalletType.MetaMask ? `${t('SIGN TO LOGIN')}` : 'MetaMask'}</span>
                {loading && (
                  <div className="loading ml-2">
                    <LoadingOutlined color="#6525FF" style={{ width: 20, height: 20, fontSize: 20 }} />
                  </div>
                )}
              </div>
              <img alt="mask" src={MetaMaskImage} style={{ width: '25px', height: '25px' }} />
            </div>
            {tempAddressObj.type === WalletType.MetaMask && <div className="mt-2 text-sm text-black">{tempAddressObj.address}</div>}
          </button>
        ) : (
          ''
        )}
      </div>
      <div className="flex flex-row w-full items-center justify-center mt-4">
        {tempAddressObj.type === WalletType.UniPass || tempAddressObj.type === WalletType.None ? (
          <button
            onClick={e => {
              e.preventDefault()
              handleConect(WalletType.UniPass)
            }}
            type="button"
            className="flex flex-col items-center justify-between dark:bg-#1a253b cursor-pointer w-full p-3 mb-2 rounded-md border border-solid border-#6525FF bg-white hover:border-#6525FF66 hover:bg-#6525FF22"
            disabled={loadingUniPass}
            style={{ cursor: `${loadingUniPass ? 'not-allowed' : ''}` }}
          >
            <div className="mb-0 text-#6525FF text-[16px] w-full frc-between">
              <div className="flex">
                <span>{tempAddressObj.type === WalletType.UniPass ? `${t('SIGN TO LOGIN')}` : 'UniPass'}</span>
                {loadingUniPass && (
                  <div className="loading ml-2">
                    <LoadingOutlined color="#6525FF" style={{ width: 20, height: 20, fontSize: 20 }} />
                  </div>
                )}
              </div>
              <img alt="unipass wallet" src={UnipassLogo} style={{ width: '22px', height: '22px' }} />
            </div>
            {tempAddressObj.type === WalletType.UniPass && <div className="mt-2 text-sm text-black">{tempAddressObj.address}</div>}
          </button>
        ) : (
          ''
        )}
      </div>
      {/* hidden */}
      {/* <span className="text-base hover:underline">I don&apos;t have a wallet</span> */}
    </div>
  )

  return isInner ? (
    panel
  ) : (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 w-full h-full z-[9999] ${
        connectBoardVisible ? 'flex flex-row' : 'hidden'
      } justify-center items-center text-2xl bg-gray-900 bg-opacity-50`}
      style={{ backdropFilter: ' blur(5px)' }}
    >
      {panel}
    </div>
  )
}

export default ConnectBoard
