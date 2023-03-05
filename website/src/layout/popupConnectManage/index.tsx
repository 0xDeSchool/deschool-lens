import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import { useState } from 'react'
import { useAccount } from '~/context/account'
import ConnectLensBoard from './connectLens'
import ConnectCyberBoard from './connectCyber'
import ConnectDeschool from './connectDeschool'

const PopupConnectManage = () => {
  const { userProfile } = useAccount()
  const [editing, setEditing] = useState(false)

  return (
    <div>
      <div className='frc-start gap-4 px-8 pt-24'>
        <Avatar size={32} alt="user avatar" src={userProfile.length > 0 && userProfile[0]?.avatar} />
        <div className="font-ArchivoNarrow text-xl">
          {userProfile.length > 0 ? userProfile[0]?.username : '--'}
        </div>
        {userProfile?.length > 0 && <Button onClick={() => setEditing(true)}>Edit</Button>}
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
