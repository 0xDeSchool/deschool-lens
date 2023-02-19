import MetaMaskImage from '~/assets/logos/mask.png'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import message from 'antd/es/message'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import { RoleType } from '~/lib/enum'

import { getUserContext } from '~/context/account'
import { useLayout } from '~/context/layout'
import type { WalletConfig } from '~/wallet'
import { createProvider, getWallet, WalletType } from '~/wallet'
import { fetchUserDefaultProfile } from '~/hooks/profile'
import { authenticate, generateChallenge } from '~/api/lens/authentication/login'
import { postVerifiedIdentity, PlatformType } from '~/api/booth/booth'

interface ConnectBoardProps {
  wallectConfig?: WalletConfig
  connectTrigger?: any
}

const ConnectLensBoard: FC<ConnectBoardProps> = props => {
  const { connectTrigger } = props
  const { connectLensBoardVisible, setConnectLensBoardVisible } = useLayout()
  const [loading, setLoading] = useState(false)
  const [tempAddress, setTempAddress] = useState<string | undefined>()
  const { t } = useTranslation()

  useEffect(() => {
    if (connectLensBoardVisible === false) {
      setLoading(false)
    }
  }, [connectLensBoardVisible])

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
    setConnectLensBoardVisible(false)
  }

  // 对传入的challenge信息签名并返回签名结果
  const signLoginMessage = async (challengeText: string) => {
    const SIGN_MESSAGE = challengeText
    const signMessageReturn = await getWallet().signMessage(SIGN_MESSAGE)
    return signMessageReturn
  }

  // 通过len签名登录
  const handleLoginByAddress = async (address: string, isReload?: boolean) => {
    // 如果当前库中已经保存过登录记录则不需要重新签名登录
    const roles = getUserContext().getLoginRoles()
    if (roles.includes(RoleType.UserOfLens)) {
      setConnectLensBoardVisible(false)
      return
    }
    try {
      // 根据钱包地址查用户profile信息
      const userInfo = await fetchUserDefaultProfile(address)
      // 没handle,则lens profile为空
      if (!userInfo) {
        getUserContext().setLensProfile(null)
        getUserContext().setLensToken(null)
        message.info({
          content: (
            <p>
              Visit{' '}
              <a className="font-bold" href="https://claim.lens.xyz" target="_blank" rel="noreferrer noopener">
                claiming site
              </a>
              to claim your profile now 🏃‍♂️
            </p>
          ),
          duration: 0,
          onClose: () => {},
        })
      }
      // 有handle,更新default profile
      else {
        getUserContext().changeUserProfile(userInfo)

        // request a challenge from the server
        const challengeResponse = await generateChallenge({ address })

        // sign the challenge text with the wallet
        const signature = await signLoginMessage(challengeResponse.text)

        // check signature
        const authenticatedResult = await authenticate({ address, signature })

        if (signature) {
          getUserContext().setLensToken({
            address,
            accessToken: authenticatedResult.accessToken,
            refreshToken: authenticatedResult.refreshToken,
          })
          // 不管是deschool还是lens登录后,均提交此地址的绑定信息给后台，后台判断是否是第一次来发 Deschool-Booth-Onboarding SBT
          await postVerifiedIdentity({
            address,
            lensHandle: userInfo?.handle,
            baseAddress: address,
            platform: PlatformType.BOOTH,
          })
        }
      }
    } catch (error: any) {
      if (error?.reason) {
        message.error(error.reason)
      } else if (error?.name && error?.message) {
        message.error(`${error.name}: ${error.message}`)
      } else if (error?.code && error?.message) {
        message.error(`${error.name}: ${error.message}`)
      } else {
        message.error(String(error))
      }
    } finally {
      setConnectLensBoardVisible(false)
      if (isReload) window.location.reload()
    }
  }

  /**
   * 链接小狐狸钱包
   * @returns
   */
  const handleConnect = async () => {
    if (loading) return
    setLoading(true)
    try {
      // 初始化小狐狸钱包并获取地址
      const config = { ...props.wallectConfig, type: WalletType.MetaMask }
      const provider = createProvider(config)
      await getWallet().setProvider(WalletType.MetaMask, provider)
      const address = await getWallet().getAddress()
      setTempAddress(address)
      if (address) {
        await handleLoginByAddress(address)
      } else {
        message.error("Can't get address info, please connect metamask first")
      }
    } catch (err: any) {
      handleFailToConnect(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connectTrigger) {
      handleLoginByAddress(connectTrigger, true)
    }
  }, [connectTrigger])

  const panel = (
    <div
      className="relative bg-white flex flex-col justify-center items-center w-full p-10 rounded-lg dark:bg-#1a253b shadow dark:shadow-slate-300"
      style={{ minHeight: '16rem', maxWidth: '38rem' }}
    >
      <p className="dark:text-white text-3xl">{t('connectWallet')}</p>
      <div
        className="text-2xl text-red-300 hover:text-red-400 cursor-pointer absolute right-6 top-0"
        onClick={e => {
          e.preventDefault()
          setConnectLensBoardVisible(false)
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
        <button
          onClick={e => {
            e.preventDefault()
            handleConnect()
          }}
          type="button"
          className="flex flex-col items-center justify-between dark:bg-#1a253b cursor-pointer w-full p-3 mb-2 rounded-md border border-solid border-#6525FF bg-white hover:border-#6525FF66 hover:bg-#6525FF22"
          disabled={loading}
          style={{ cursor: `${loading ? 'not-allowed' : ''}` }}
        >
          <div className="mb-0 text-#6525FF text-[16px] w-full frc-between">
            <div className="flex">
              <span>{t('SIGN TO LOGIN BY LENS')}</span>
              {loading && (
                <div className="loading ml-2 frc-center">
                  <LoadingOutlined color="#6525FF" style={{ width: 20, height: 20, fontSize: 20 }} />
                </div>
              )}
            </div>
            <img alt="mask" src={MetaMaskImage} style={{ width: '25px', height: '25px' }} />
          </div>
          <div className="mt-2 text-sm text-black">{tempAddress}</div>
        </button>
      </div>
    </div>
  )

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 w-full h-full z-[9999] ${
        connectLensBoardVisible ? 'flex flex-row' : 'hidden'
      } justify-center items-center text-2xl bg-gray-900 bg-opacity-50`}
      style={{ backdropFilter: ' blur(5px)' }}
    >
      {panel}
    </div>
  )
}

export default ConnectLensBoard
