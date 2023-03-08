import Popover from 'antd/es/popover'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button/button'
import { RightOutlined } from '@ant-design/icons'
import Modal from 'antd/es/modal'
import { DEFAULT_AVATAR, useAccount } from '~/account'
import PopupConnectManage from './popupConnectManage'
import { CyberConnectIcon, DeschoolIcon, LensIcon } from '~/components/icon'
import { getShortAddress } from '~/utils/format'

type PopoverAccountInfoProps = {
  open: () => void
}
const PopoverAccountInfo: React.FC<PopoverAccountInfoProps> = (props) => {
  const { open } = props
  const user = useAccount()
  const lens = user?.lensProfile()
  const cc = user?.ccProfile()
  const deschool = user?.deschoolProfile()
  return (
    <div className="bg-white rounded-2 px-2 py-3 fcc-start gap-4">
      {user && <div className="w-full frc-between gap-8">
        <div className='frc-start'>
          <div className="bg-#774ff8 rounded-50% w-28px h-28px frc-center">
            <DeschoolIcon style={{width: '20px', height: '20px'}} />
          </div>
          <span className='ml-2'>{user.formateName()}</span>
        </div>
        <Button className='frc-center' onClick={open}>Expand<RightOutlined /></Button>
      </div>}
      {lens && <div className="w-full frc-between gap-8">
        <div className='frc-start'>
          <div className="bg-#abfe2c rounded-50% w-28px h-28px frc-center">
            <LensIcon alt="lens" width={20} height={20} />
          </div>
          <span className='ml-2'>{lens.handle}</span>
        </div>
        <div>+{user?.lensProfileList()?.length || 0}</div>
      </div>}
      {cc && <div className="w-full frc-between gap-8">
        <div className='frc-between'>
          <div className="bg-black rounded-50% w-28px h-28px frc-center">
            <CyberConnectIcon style={{color: 'white'}} alt="cyberconnect" width={20} height={20} />
          </div>
          <span className='ml-2'>{cc.handle}</span>
        </div>
        <div>+{user?.ccProfileList()?.length || 0}</div>
      </div>}
      {deschool && <div className="w-full frc-between gap-8">
        <div className='frc-start'>
          <div className="bg-#774ff8 rounded-50% w-28px h-28px frc-center">
            <DeschoolIcon style={{width: '20px', height: '20px'}} />
          </div>
          <span className='ml-2'>
            {getShortAddress(deschool.address)}
          </span>
        </div>
        <div>+{user?.deschoolProfileList()?.length || 0}</div>
      </div>}
    </div>
  )
}

const WalletConnectBoard = () => {
  const { t } = useTranslation()
  const user = useAccount()
  const [open, setOpen] = useState(false)
  const [showPopover, setShowPopover] = useState(false)
  const onClick = () => {
    setOpen(true)
  }

  return (
    <>
      {!user && <button
        type="button"
        className="mx-auto text-white text-center text-xl whitespace-nowrap font-ArchivoNarrow min-w-100px w-200px h-48px bg-primary hover:bg-accent"
        onClick={() => onClick()}
      >
        <div className="mx-3 py-2">{t('Connect Wallet')}</div>
      </button>}
      {user &&
        (<Popover
          placement="bottomRight"
          content={
            <PopoverAccountInfo
              open={() => {
                setOpen(true)
                setShowPopover(false)
              }
              } />
          }
          open={showPopover}
          onOpenChange={(e: any) => setShowPopover(e)}
          trigger="click">
          <div className='frc-center cursor-pointer'>
            <Avatar size={24} alt="user avatar" src={user.avatar || DEFAULT_AVATAR} />
            <div className="font-ArchivoNarrow text-xl ml-2">
              {user.formateName()}
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
        <PopupConnectManage close={() => setOpen(false)} />
      </Modal>
    </>
  )
}

export default WalletConnectBoard
