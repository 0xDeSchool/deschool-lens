import Popover from 'antd/es/Popover'
import { useEffect, useState } from 'react'
import IconCyberConnect from '~/assets/icons/cyberConnect.svg'
import IconDeschool from '~/assets/icons/deschool.svg'
import IconLens from '~/assets/icons/lens.svg'
import { useTranslation } from 'react-i18next'
import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button/button'
import { RightOutlined } from '@ant-design/icons'
import PopupConnectManage from '../popupConnectManage'
import Modal from 'antd/es/modal'
import { DEFAULT_AVATAR, getUserManager, useAccount } from '~/account'

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
            <img src={IconDeschool} alt="lens" width={20} height={20} />
          </div>
          <span className='ml-2'>{user.formateName()}</span>
        </div>
        <Button className='frc-center' onClick={open}>Expand<RightOutlined /></Button>
      </div>}
      {lens && <div className="w-full frc-between gap-8">
        <div className='frc-start'>
          <div className="bg-#abfe2c rounded-50% w-28px h-28px frc-center">
            <img src={IconLens} alt="lens" width={20} height={20} />
          </div>
          <span className='ml-2'>{lens.handle}</span>
        </div>
        <div>+{user?.lensProfileList()?.length || 0}</div>
      </div>}
      {cc && <div className="w-full frc-between gap-8">
        <div className='frc-between'>
          <div className="bg-black rounded-50% w-28px h-28px frc-center">
            <img src={IconCyberConnect} alt="lens" width={20} height={20} />
          </div>
          <span className='ml-2'>{cc.handle}</span>
        </div>
        <div>+{user?.ccProfileList()?.length || 0}</div>
      </div>}
      {deschool && <div className="w-full frc-between gap-8">
        <div className='frc-start'>
          <div className="bg-#774ff8 rounded-50% w-28px h-28px frc-center">
            <img src={IconDeschool} alt="lens" width={20} height={20} />
          </div>
          <span className='ml-2'>
            {deschool.displayName}
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
  const onClick = (e: any) => {
    e.preventDefault()
    setOpen(true)
  }

  useEffect(() => {
    if (!user) {
      getUserManager().tryAutoLogin()
    }
  }, [user])

  return (
    <>
      {!user && <button
        type="button"
        className="mx-auto text-white text-center text-xl whitespace-nowrap font-ArchivoNarrow min-w-100px w-200px h-48px bg-primary hover:bg-accent"
        onClick={(e) => onClick(e)}
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
          onOpenChange={(e) => setShowPopover(e)}
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
        <PopupConnectManage close={() => setOpen(false)}/>
      </Modal>
    </>
  )
}

export default WalletConnectBoard
