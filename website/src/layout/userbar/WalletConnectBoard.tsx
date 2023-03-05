import Dropdown from 'antd/es/dropdown'
import { MenuProps } from 'antd/es/menu'
import Popover from 'antd/es/Popover'
import message from 'antd/es/message'
import { ReactElement, useState } from 'react'
import { getUserContext, useAccount } from '~/context/account'
import { useLayout } from '~/context/layout'
import IconCyberConnect from '~/assets/icons/cyberConnect.svg'
import IconDeschool from '~/assets/icons/deschool.svg'
import IconLens from '~/assets/icons/lens.svg'
import { getShortAddress } from '~/utils/format'
import { useTranslation } from 'react-i18next'
import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button/button'
import { RightOutlined } from '@ant-design/icons'
import PopupConnectManage from '../popupConnectManage'

const WalletConnectBoard1 = () => {
  const { t } = useTranslation()
  const {
    setConnectLensBoardVisible,
    setConnectDeschoolBoardVisible,
    setCyberConnectBoardVisible
  } = useLayout()
  const [isShowDeschoolUserMenu, setDeschoolUserMenu] = useState(false)
  const [isShowLensUserMenu, setLensUserMenu] = useState(false)
  const [isShowCyberConnectUserMenu, setCyberConnectUserMenu] = useState(false)
  const { lensProfile, lensToken, cyberToken, cyberProfile, deschoolProfile } = useAccount()

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

  const handleLoginLens = async () => {
    setConnectLensBoardVisible(true)
  }

  const handleLoginDeschool = async () => {
    setConnectDeschoolBoardVisible(true)
  }

  return (
    <div className="flex flex-col items-center justify-end mr-4">
      <Dropdown menu={{ items: cyberConnectItems }} placement="bottom" trigger={['click']} open={isShowCyberConnectUserMenu}>
        <span
          className="frc-center bg-black rounded-xl px-4 mr-4 cursor-pointer"
          onClick={e => {
            e.preventDefault()
            if (cyberToken) {
              handleToggleCyberConnectMenu()
            } else {
              setCyberConnectBoardVisible(true)
            }
          }}
        >
          <img src={IconCyberConnect} alt="lens" width={20} height={20} />
          <button type="button" className="text-white text-14px ml-2 font-ArchivoNarrow">
            {cyberProfile ? cyberProfile?.handle : t('CyberConnect')}
          </button>
        </span>
      </Dropdown>
      <Dropdown menu={{ items: LensItems }} placement="bottom" trigger={['click']} open={isShowLensUserMenu}>
        <span
          className="frc-center bg-#abfe2c rounded-xl px-4 mr-4 cursor-pointer "
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
          className="frc-center bg-#774ff8 rounded-xl px-4 cursor-pointer"
          onClick={e => {
            e.preventDefault()
            if (deschoolProfile) {
              handleToggleDeschoolMenu()
            } else {
              handleLoginDeschool()
            }
          }}
        >
          <img src={IconDeschool} alt="lens" width={20} height={24} />
          <button type="button" className="text-white text-14px ml-2 font-ArchivoNarrow">
            {deschoolProfile ? getShortAddress(deschoolProfile?.address) : t('Connect Deschool')}
          </button>
        </span>
      </Dropdown>
    </div>
  )
}

const PopoverAccountInfo = () => {
  const { lensProfile, cyberProfile, deschoolProfile, userProfile } = useAccount()
  return (
    <div className="bg-white rounded-2 px-2 py-3 fcc-start gap-4">
      {userProfile?.length > 0 && <div className="w-full frc-between gap-8">
        <div className='frc-start'>
          <div className="bg-#abfe2c rounded-50% w-28px h-28px frc-center">
            <img src={IconLens} alt="lens" width={20} height={20} />
          </div>
          <span className='ml-2'>{userProfile[0].username}</span>
        </div>
        <Button className='frc-center'>Expand<RightOutlined /></Button>
      </div>}
      {lensProfile && <div className="w-full frc-between gap-8">
        <div className='frc-start'>
          <div className="bg-#abfe2c rounded-50% w-28px h-28px frc-center">
            <img src={IconLens} alt="lens" width={20} height={20} />
          </div>
          <span className='ml-2'>{lensProfile?.handle}</span>
        </div>
        <div>+2</div>
      </div>}
      {cyberProfile && <div className="w-full frc-between gap-8">
        <div className='frc-between'>
          <div className="bg-black rounded-50% w-28px h-28px frc-center">
            <img src={IconCyberConnect} alt="lens" width={20} height={20} />
          </div>
          <span className='ml-2'>{cyberProfile.handle}</span>
        </div>
        <div>+2</div>
      </div>}
      {deschoolProfile && <div className="w-full frc-between gap-8">
        <div className='frc-start'>
          <div className="bg-#774ff8 rounded-50% w-28px h-28px frc-center">
            <img src={IconDeschool} alt="lens" width={20} height={20}/>
          </div>
          <span className='ml-2'>
            {deschoolProfile?.username === deschoolProfile?.address ? getShortAddress(deschoolProfile?.address) : deschoolProfile?.username }
          </span>
        </div>
        <div>+2</div>
      </div>}
    </div>
  )
}


const WalletConnectBoard = () => {
  const { t } = useTranslation()
  const { userProfile } = useAccount()
  const [showPopover, setShowPopover] = useState(false)
  const onClick = (e: any) => {
    e.preventDefault()
    setShowPopover(true)
  }
  return (
    <>
     {!userProfile?.length && <button
      type="button"
      className="mx-auto text-white text-center text-xl whitespace-nowrap font-ArchivoNarrow min-w-100px w-200px h-48px bg-primary hover:bg-accent"
      onClick={(e) => onClick(e)}
    >
      <div className="mx-3 py-2">{t('Connect Wallet')}</div>
    </button>}
    {userProfile?.length > 0 &&
    <Popover placement="bottomRight" content={<PopoverAccountInfo />} trigger="click">
      <div className='frc-center cursor-pointer'>
        <Avatar size={24} alt="user avatar" src={userProfile[0].avatar} />
        <div className="font-ArchivoNarrow text-xl ml-2">
          {userProfile[0].username}
        </div>
      </div>
    </Popover>}
    {showPopover && <PopupConnectManage /> }
    </>
  )
}

export default WalletConnectBoard
