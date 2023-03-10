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

  return (
    <div>
      <div className='text-xl frc-between'>
        <h1 className='text-2xl font-Anton'>Booth</h1>
        <Button shape='circle' size='large' icon={<CloseCircleOutlined style={{color: '#999'}} />} className="frc-center" onClick={() => close()} />
      </div>
      <UpdateUsername />
      <div className='frc-center gap-8 px-8 pt-8 pb-12'>
        <div className='item-connect flex-1 max-w-300px min-w-300px'>
          <ConnectDeschool />
        </div>
        <div className='item-connect flex-1 max-w-300px min-w-300px'>
          <ConnectCyberBoard />
        </div>
        <div className='item-connect flex-1 max-w-300px min-w-300px'>
          <ConnectLensBoard />
        </div>
      </div>
    </div>
  )
}

export default PopupConnectManage
