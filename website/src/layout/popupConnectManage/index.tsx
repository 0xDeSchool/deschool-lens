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
      {userProfile?.length > 0 && <div className='h-80vh frc-start gap-2 cursor-pointer'>
        <Avatar size={24} alt="user avatar" src={userProfile[0].avatar} />
        <div className="font-ArchivoNarrow text-xl ml-2">
          {userProfile[0].username}
        </div>
        <Button onClick={() => setEditing(true)}>Edit</Button>
      </div>}
      <div className='frc-center gap-4'>
        <div className='item-connect'>
          <ConnectDeschool />
        </div>
        <div className='item-connect'>
          <ConnectCyberBoard />
        </div>
        <div className='item-connect'>
          <ConnectLensBoard />
        </div>
      </div>
    </div>
  )
}

export default PopupConnectManage
