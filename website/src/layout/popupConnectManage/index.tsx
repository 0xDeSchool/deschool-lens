import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import { useState } from 'react'
import { useAccount } from '~/context/account'
import ConnectLensBoard from '../connectLens'
import ConnectCyberBoard from '../cyberConnect'
import ConnectDeschool from '../connectDeschool'

const PopupConnectManage = () => {
  const { userProfile } = useAccount()
  const [editing, setEditing] = useState(false)

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 w-full h-full z-[9999] ${
        true ? 'flex flex-row' : 'hidden'
      } justify-center items-center text-2xl bg-gray-900 bg-opacity-50`}
      style={{ backdropFilter: ' blur(5px)' }}
    >
      {userProfile?.length > 0 && <div className='frc-start gap-2 cursor-pointer'>
        <Avatar size={24} alt="user avatar" src={userProfile[0].avatar} />
        <div className="font-ArchivoNarrow text-xl ml-2">
          {userProfile[0].username}
        </div>
        <Button onClick={() => setEditing(true)}>Edit</Button>
      </div>}
      <div className='grid grid-cols gap-4'>
      <div>
          <ConnectDeschool />
        </div>
        <div>
          <ConnectCyberBoard />
        </div>
        <div>
          <ConnectLensBoard />
        </div>
      </div>
    </div>
  )
}

export default PopupConnectManage
