import MetaMaskImage from '~/assets/logos/mask.png'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import message from 'antd/es/message'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'

import type { WalletConfig } from '~/wallet'
import { createProvider, getWallet, WalletType } from '~/wallet'
import { fetchUserDefaultProfile } from '~/hooks/profile'
import { authenticate, generateChallenge } from '~/api/lens/authentication/login'
import { postVerifiedIdentity, PlatformType } from '~/api/booth/booth'
import IconLens from '~/assets/icons/lens.svg'
import Button from 'antd/es/button'
import { linkPlatform } from '~/api/booth/account'
import { getUserManager, useAccount } from '~/account/context'
import { LogoutOutlined } from '@ant-design/icons'

interface ConnectBoardProps {
  wallectConfig?: WalletConfig
  connectTrigger?: any
}

const ConnectLensBoard: FC<ConnectBoardProps> = props => {
  const { connectTrigger } = props
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const user = useAccount()
  const lensProfile = user?.lensProfile()

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
    if (lensProfile) {
      return
    }
    try {
      // 根据钱包地址查用户profile信息
      const userInfo = await fetchUserDefaultProfile(address)
      // 没handle,则lens profile为空
      if (!userInfo) {
        message.info({
          key: 'nohandle',
          content: (
            <p className="inline">
              Visit
              <a className="font-bold mx-2" href="https://claim.lens.xyz" target="_blank" rel="noreferrer noopener">
                claiming site
              </a>
              to claim your profile now 🏃‍♂️
              <CloseOutlined
                size={12}
                className="inline ml-2 hover:color-purple!"
                onClick={() => {
                  message.destroy('nohandle')
                }}
              />
            </p>
          ),
          duration: 0,
        })
      }
      // 有handle,更新default profile
      else {
        // request a challenge from the server
        const challengeResponse = await generateChallenge({ address })

        // sign the challenge text with the wallet
        const signature = await signLoginMessage(challengeResponse.text)

        // check signature
        const authenticatedResult = await authenticate({ address, signature })

        if (!signature) return

        // 不管是deschool还是lens登录后,均提交此地址的绑定信息给后台，后台判断是否是第一次来发 Deschool-Booth-Onboarding SBT
        await postVerifiedIdentity({
          address,
          lensHandle: userInfo?.handle,
          baseAddress: address,
          platform: PlatformType.LENS,
        })

        // 关联平台
        await linkPlatform({
          handle: userInfo?.handle,
          platform: PlatformType.LENS,
          data: {
            id: userInfo?.id,
            accessToken: authenticatedResult.accessToken,
            refreshToken: authenticatedResult.refreshToken,
          },
          address,
          displayName: userInfo.name,
        })
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
      if (address) {
        await handleLoginByAddress(address)
        // 重新获取用户信息
        await getUserManager().tryAutoLogin()
      } else {
        message.error("Can't get address info, please connect metamask first")
      }
    } catch (err: any) {
      handleFailToConnect(err)
    } finally {
      setLoading(false)
    }
  }

  // 退出 Lens 登录
  const handleDisconnect = async () => {
    try {
      if (lensProfile?.handle) {
        getUserManager()?.unLinkPlatform(lensProfile?.handle, lensProfile.address, PlatformType.LENS)
        // 重新获取用户信息
        await getUserManager().tryAutoLogin()
      }
    } catch (error: any) {
      message.error(error?.message ? error.message : '退出登录失败')
    }
  }

  useEffect(() => {
    if (connectTrigger) {
      handleLoginByAddress(connectTrigger, true)
    }
  }, [connectTrigger])

  return (
    <div className="fcc-between w-full min-h-360px p-4 rounded-lg shadow">
      <div className='fcs-start w-full'>
        <div className="bg-#abfe2c rounded-2 px-2 py-2 frc-start">
          <img src={IconLens} alt="lens" width={20} height={20} />
          <span className='ml-1 text-#00501E'>LENS</span>
        </div>
        {lensProfile && <div className='frc-between mt-4'>
          <div className="frc-start">
            <div className="bg-#abfe2c rounded-50% w-28px h-28px frc-center">
              <img src={IconLens} alt="cyberconnect" width={20} height={20} />
            </div>
            <span className='ml-2'>{lensProfile.handle}</span>
          </div>
          <Button type="primary" size='small' shape="circle" icon={<LogoutOutlined />} className="frc-center" onClick={handleDisconnect} />
        </div>}
      </div>
      <div className="flex flex-row w-full items-center justify-center">
        <Button
          onClick={e => {
            e.preventDefault()
            lensProfile ? handleDisconnect() : handleConnect()
          }}
          className="w-full h-12 border border-solid border-#6525FF bg-white hover:border-#6525FF66 hover:bg-#6525FF22"
          disabled={loading}
        >
          {!lensProfile ? (<div className="text-#6525FF text-[16px] w-full frc-between">
            <div className="frc-start">
              <span className='mr-2'>CONNECT</span>
              {loading && (
                <LoadingOutlined color="#6525FF" />
              )}
            </div>
            <img alt="mask" src={MetaMaskImage} style={{ width: '25px', height: '25px' }} />
          </div>) :
            (<div className="text-#6525FF text-[16px] w-full frc-center">
              DISCONNECT
            </div>)}
        </Button>
      </div>
    </div>
  )
}

export default ConnectLensBoard
