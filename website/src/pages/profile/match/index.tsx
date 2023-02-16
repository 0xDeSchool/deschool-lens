import { useState } from 'react'
import Alert from 'antd/es/alert'
import ConnectDeschoolBoard from '~/pages/profile/match/connectDeschool'
import MatchConfig from './MatchConfig'
import TalentRadar from './TalentRadar'

const Match = () => {
  const [connectBoardVisible, setConnectBoardVisible] = useState(false) // 控制请求面板显隐

  const handleConnectDeschool = async () => {
    if (connectBoardVisible) {
      return
    }
    setConnectBoardVisible(true)
  }

  return (
    <div className="w-full fcc-start">
      <h1 className="text-2xl font-bold font-ArchivoNarrowBold">Match Your Potential Friends / Partners</h1>
      {/* 雷达图 */}
      <TalentRadar />
      {/* 雷达图下说明文字 + 链接身份 */}
      <div className="w-full text-center">
        <div className="text-left my-2">
          <Alert
            message={<b>Booth Perk Graph (BPG) still in BETA</b>}
            description="The radar chart is generated based on the current address and the credible on-chain education and work proof of the associated address on the Booth platform, and the data is obtained, classified and dynamically calculated by the intelligent backend. If you have any questions about the radar chart, please provide feedback through the form below."
            type="info"
            showIcon
          />
        </div>
        <h1>You can gain perks by connecting trusted education and career credential providers:</h1>
        <div className="frc-center my-4">
          <button type="button" className="purple-border-button p-2 mr-4" onClick={handleConnectDeschool}>
            <span>Connect Deschool</span>
          </button>
          <button type="button" className="purple-border-button p-2">
            <span>Connect Professional</span>
          </button>
        </div>
        <p className="w-full text-center text-gray-5 text-14px">Not found your source? Fill a form and let us know!</p>
      </div>
      {/* 填表环节 */}
      <div className="w-full h-1px bg-gray-3"> </div>
      <MatchConfig />
      <ConnectDeschoolBoard setConnectBoardVisible={setConnectBoardVisible} connectBoardVisible={connectBoardVisible} />
    </div>
  )
}

export default Match
