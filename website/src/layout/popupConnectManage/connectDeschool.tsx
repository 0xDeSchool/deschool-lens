import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import message from 'antd/es/message'

import { LoadingOutlined } from '@ant-design/icons'
import { getNonceByUserAddress, postNonceSigByUserAddress } from '~/api/go/user'
import UnipassLogo from '~/assets/logos/unipass.svg'
import MetaMaskImage from '~/assets/logos/mask.png'
import type { WalletConfig } from '~/wallet'
import { createProvider, getWallet, WalletType } from '~/wallet'
import { getUserContext, useAccount } from '~/context/account'
import { PlatformType, postVerifiedIdentity } from '~/api/booth/booth'
import DeschoolLogoDark from '~/assets/logos/logo-main.png'
import IconDeschool from '~/assets/icons/deschool.svg'
import Button from 'antd/es/button'
import { getShortAddress } from '~/utils/format'
import { login } from '~/api/booth/account'

const ConnectDeschoolBoard: FC = () => {
  const { setDescoolProfile, deschoolProfile } = useAccount()
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
    const FIX_FORMAT_MESSAGE = `DeSchool is kindly requesting to Sign in with ${
      getWallet().type
    } securely, with nonce: ${nonce}. Sign and login now, begin your journey to DeSchool!`
    const signMessageReturn = await getWallet().signMessage(FIX_FORMAT_MESSAGE)
    return signMessageReturn
  }

  // 调用deschool接口签名并登录
  const handleLoginByAddress = async (address: string) => {
    try {
      const nonceRes: any = await getNonceByUserAddress({ address })
      if (!nonceRes.success) {
        throw nonceRes.error
      }
      const { nonce } = nonceRes
      const loginSig = await signLoginMessage(nonce)

      const validationRes: any = await login({
        walletType: getWallet().type!,
        address,
        sig: loginSig,
      })
      if (validationRes && validationRes.address && validationRes.jwtToken) {
        setDescoolProfile({ ...validationRes })
        // 不管是deschool还是lens登录后,均提交此地址的绑定信息给后台，后台判断是否是第一次来发 Deschool-Booth-Onboarding SBT
        await postVerifiedIdentity({
          address,
          baseAddress: address,
          platform: PlatformType.DESCHOOL,
        })
      } else {
        setDescoolProfile(null)
      }
    } catch (error) {
      message.error(t('signMessageError'))
      throw error
    } finally {
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
      const address = await getWallet().getAddress()
      if (address) {
        handleLoginByAddress(address)
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

    // 退出 Deschool 登录
  const handleDisconect = () => {
    try {
      getUserContext().disconnectFromDeschool()
    } catch (error: any) {
      message.error(error?.message ? error.message : '退出登录失败')
    }
  }

  return (
    <div className="fcc-between w-full min-h-360px p-4 rounded-lg shadow">
      <div className='fcs-start w-full'>
        <div className="rounded-2 px-2 py-2 frc-start">
          <img src={DeschoolLogoDark} alt="lens" width={160} height={24}/>
        </div>
        {deschoolProfile && <div className="frc-start mt-4">
          <div className="bg-#774ff8 rounded-50% w-28px h-28px frc-center">
            <img src={IconDeschool} alt="cyberconnect" width={20} height={20} />
          </div>
          <span className='ml-2'>{deschoolProfile.username && deschoolProfile.username === deschoolProfile.address ? getShortAddress(deschoolProfile.address) : deschoolProfile.username}</span>
        </div>}
      </div>
      <div className='fcc-center w-full'>
        {!deschoolProfile ?
        <>
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
                    <LoadingOutlined color="#6525FF"/>
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
                    <LoadingOutlined color="#6525FF"/>
                  )}
                </div>
                <img alt="mask" src={UnipassLogo} style={{ width: '25px', height: '25px' }} />
              </div>
            </Button>
          </div>
        </>:
        <div className="flex flex-row w-full items-center justify-center">
          <Button
            onClick={e => {
              e.preventDefault()
              handleDisconect()
            }}
            className="w-full h-12 border border-solid border-#6525FF bg-white hover:border-#6525FF66 hover:bg-#6525FF22"
            disabled={loading}
          >
            <div className="text-#6525FF text-[16px] w-full frc-center">
              DISCONNECT
            </div>
          </Button>
        </div>}
      </div>
    </div>
  )
}

export default ConnectDeschoolBoard
