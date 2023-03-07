import Avatar from 'antd/es/avatar'
import { DEFAULT_AVATAR, useAccount } from '~/account'
import { CloseCircleOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import ConnectLensBoard from './connectLens'
import ConnectCyberBoard from './connectCyber'
import ConnectDeschool from './connectDeschool'
import UpdateUsername from './updateUserInfo'

type PopupConnectManageProps = {
  close: () => void
}
const PopupConnectManage: React.FC<PopupConnectManageProps> = (props) => {
  const { close } = props
  const user = useAccount()

  return (
    <div>
      <div className='text-xl frc-between'>
        <span>Booth</span>
        <Button shape='circle' size='large' icon={<CloseCircleOutlined style={{color: '#999'}} />} className="frc-center" onClick={() => close()} />
      </div>
      <div className='frc-start gap-1 px-8 pt-24'>
        <Avatar size={32} alt="user avatar" src={user && user.avatar || DEFAULT_AVATAR} />
        <UpdateUsername defaultUsername={user?.formateName() ?? ''} disabled={!user}/>
      </div>
      <div className='frc-center gap-8 px-8 pt-8 pb-24'>
        <div className='item-connect flex-1'>
          <ConnectDeschool />
        </div>
        <div className='item-connect flex-1'>
          <ConnectCyberBoard />
        </div>
        <div className='item-connect flex-1'>
          <ConnectLensBoard />
        </div>
      </div>
    </div>
  )
}

export default PopupConnectManage
