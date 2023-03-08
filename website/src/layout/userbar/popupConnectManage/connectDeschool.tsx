import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import message from 'antd/es/message'

import { LoadingOutlined, LogoutOutlined } from '@ant-design/icons'
import UnipassLogo from '~/assets/logos/unipass.svg'
import MetaMaskImage from '~/assets/logos/mask.png'
import type { WalletConfig } from '~/wallet'
import { createProvider, getWallet, WalletType } from '~/wallet'
import { PlatformType, postVerifiedIdentity } from '~/api/booth/booth'
import DeschoolLogoDark from '~/assets/logos/logo-main.png'
import IconDeschool from '~/assets/icons/deschool.svg'
import Button from 'antd/es/button'
import { getUserManager, useAccount } from '~/account'
import { linkPlatform } from '~/api/booth'
import { UserPlatform } from '~/api/booth/types'
import { getShortAddress } from '~/utils/format'

const ConnectDeschoolBoard: FC = () => {
  const userManager = getUserManager()
  const [loading, setLoading] = useState(false)
  const [loadingUniPass, setLoadingUniPass] = useState(false)
  // MetaMask or UniPass
  const { t } = useTranslation()

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

  const signLoginMessage = async (nonce: string) => {
    const signMessageReturn = await getWallet().signMessage(nonce)
    return signMessageReturn
  }

  // 调用deschool接口签名并登录
  const handleLoginByAddress = async () => {
    await userManager.login()
    if (userManager.user) {
      // 不管是deschool还是lens登录后,均提交此地址的绑定信息给后台，后台判断是否是第一次来发 Deschool-Booth-Onboarding SBT
      await postVerifiedIdentity({
        address: userManager.user.address,
        baseAddress: userManager.user.address,
        platform: PlatformType.BOOTH,
      })

      // 关联平台
      await linkPlatform({
        handle: userManager.user.address,
        platform: PlatformType.DESCHOOL,
        address: userManager.user.address,
      })
    }
  }

  /**
   * 选择并连接一个第三方钱包，如果连接以后就签名登录deshcool
   * @returns
   */
  const handleConect = async (type: WalletType) => {
    if (loadingUniPass || loading) return
    if (type === WalletType.MetaMask) {
      setLoading(true)
    } else {
      setLoadingUniPass(true)
    }
    try {
      const config: WalletConfig = { type }
      const provider = createProvider(config)
      await getWallet().setProvider(type, provider)
      handleLoginByAddress()
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

  // 退出 Deschool 登录
  const handleDisconect = () => {
    try {
      userManager.disconnect()
    } catch (error: any) {
      message.error(error?.message ? error.message : '退出登录失败')
    }
  }

  const handleUnlinkDeschool = async (deschoolProfile: UserPlatform) => {
    try {
      if (deschoolProfile?.handle) {
        getUserManager()?.unLinkPlatform(deschoolProfile?.handle, deschoolProfile.address, PlatformType.DESCHOOL)
        // 重新获取用户信息
        await getUserManager().tryAutoLogin()
      }
    } catch (error: any) {
      message.error(error?.message ? error.message : '退出登录失败')
    }
  }

  const user = useAccount()

  return (
    <div className="fcc-between w-full min-h-360px p-4 rounded-lg shadow">
      <div className='fcs-start w-full'>
        <div className="rounded-2 px-2 py-2 frc-start">
          <img src={DeschoolLogoDark} alt="lens" width={160} height={24} />
        </div>
        {user?.deschoolProfileList()?.map(deschoolProfile => (
          <div key={deschoolProfile.handle} className='frc-between mt-4'>
            <div className="frc-start">
              <div className="bg-#774ff8 rounded-50% w-28px h-28px frc-center">
                <img src={IconDeschool} alt="deschool" width={20} height={20} />
              </div>
              <span className='ml-2'>{getShortAddress(deschoolProfile.address)}</span>
            </div>
            <Button type="primary" size='small' shape="circle" icon={<LogoutOutlined />} className="frc-center" onClick={() => handleUnlinkDeschool(deschoolProfile)} />
          </div>
        ))}
      </div>
      <div className='fcc-center w-full'>
        <div className="frc-center w-full">
          <Button
            onClick={e => {
              e.preventDefault()
              handleConect(WalletType.MetaMask)
            }}
            className="w-full h-12 border border-solid border-#6525FF bg-white hover:border-#6525FF66 hover:bg-#6525FF22"
            disabled={loading}
          >
            <div className="text-#6525FF text-[16px] w-full frc-between">
              <div className="frc-start">
                <span className='mr-2'>MetaMask</span>
                {loading && (
                  <LoadingOutlined color="#6525FF" />
                )}
              </div>
              <img alt="mask" src={MetaMaskImage} style={{ width: '25px', height: '25px' }} />
            </div>
          </Button>
        </div>
        <div className="frc-center w-full mt-4">
          <Button
            onClick={e => {
              e.preventDefault()
              handleConect(WalletType.UniPass)
            }}
            className="w-full h-12 border border-solid border-#6525FF bg-white hover:border-#6525FF66 hover:bg-#6525FF22"
            disabled={loadingUniPass}
          >
            <div className="text-#6525FF text-[16px] w-full frc-between">
              <div className="frc-start">
                <span className='mr-2'>UniPass</span>
                {loadingUniPass && (
                  <LoadingOutlined color="#6525FF" />
                )}
              </div>
              <img alt="mask" src={UnipassLogo} style={{ width: '25px', height: '25px' }} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConnectDeschoolBoard
