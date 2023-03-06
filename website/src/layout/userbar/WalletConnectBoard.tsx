import Dropdown from 'antd/es/dropdown'
import { MenuProps } from 'antd/es/menu'
import Popover from 'antd/es/Popover'
import message from 'antd/es/message'
import { useState } from 'react'
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
import Modal from 'antd/es/modal'

type PopoverAccountInfoProps = {
  open: () => void
}
const PopoverAccountInfo: React.FC<PopoverAccountInfoProps> = (props) => {
  const { open } = props
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
        <Button className='frc-center' onClick={open}>Expand<RightOutlined /></Button>
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
  const [open, setOpen] = useState(false)
  const [showPopover, setShowPopover] = useState(false)
  const onClick = (e: any) => {
    e.preventDefault()
    setOpen(true)
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
      (<Popover
        placement="bottomRight"
        content={<PopoverAccountInfo open={() => {
          setOpen(true)
          setShowPopover(false)
        }}/>}
        open={showPopover}
        onOpenChange={(e) => setShowPopover(e)}
        trigger="click">
        <div className='frc-center cursor-pointer'>
          <Avatar size={24} alt="user avatar" src={userProfile[0].avatar} />
          <div className="font-ArchivoNarrow text-xl ml-2">
            {userProfile[0].username}
          </div>
        </div>
      </Popover>)}
      <Modal
        wrapClassName=""
        open={open}
        width='80%'
        title={null}
        footer={null}
        closable={false}
        centered
        closeIcon={null}
        style={{ height: '80vh' }}
        onCancel={() => {
          setOpen(false)
        }}
        destroyOnClose
      >
        <PopupConnectManage />
      </Modal>
    </>
  )
}

export default WalletConnectBoard
