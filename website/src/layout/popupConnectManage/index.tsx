import Avatar from 'antd/es/avatar'
import ConnectLensBoard from './connectLens'
import ConnectCyberBoard from './connectCyber'
import ConnectDeschool from './connectDeschool'
import UpdateUsername from './updateUserInfo'
import { useAccount } from '~/account'

const PopupConnectManage = () => {
  const user = useAccount()

  return (
    <div>
      <div className='text-xl'>
        Booth
      </div>
      <div className='frc-start gap-1 px-8 pt-24'>
        <Avatar size={32} alt="user avatar" src={user && user.avatar} />
        <UpdateUsername defaultUsername={user?.formateName() ?? ''} />
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
