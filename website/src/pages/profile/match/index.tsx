import message from 'antd/es/message'
import Alert from 'antd/es/alert'
import { useLayout } from '~/context/layout'
import MatchConfig from './MatchConfig'
import TalentRadar from './TalentRadar'
import { useAccount } from '~/account'

const Match = () => {
  const { connectBoardVisible, setConnectBoardVisible } = useLayout() // 控制请求面板显隐
  const user = useAccount()

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
            description="The radar chart is generated based on the current address and the credible on-chain education and working proofs of all your connected addresses on the Booth platform. If you have any questions about the radar chart, please provide feedback through the form below."
            type="info"
            showIcon
          />
        </div>
        <h1>You can gain perks by connecting existed addresses or learning courses from trusted providers:</h1>
        <div className="frc-center my-4">
          {user ? (
            <button type="button" className="border border-gray rounded-xl bg-gray-3 text-gray-6 hover:cursor-not-allowed p-2 mr-4">
              <span>Verified by Deschool</span>
            </button>
          ) : (
            <button
              type="button"
              className="purple-border-button p-2 mr-4"
              onClick={() => {
                handleConnectDeschool()
              }}
            >
              <span>Connect Deschool</span>
            </button>
          )}
          <button
            type="button"
            className="purple-border-button p-2 mr-4"
            onClick={() => {
              message.success('coming soon')
            }}
          >
            <span>Connect Professional</span>
          </button>
          <a href="https://deschool.app" target="_blank" rel="noreferrer">
            <button type="button" className="purple-border-button p-2">
              <span>Learn Courses</span>
            </button>
          </a>
        </div>
        <div className="mb-4">
          <a
            href="https://forms.gle/ZwXysgm3ne3TRocA8"
            target="_blank"
            rel="noreferrer"
            className="w-full text-center text-gray-5 text-14px "
          >
            {'Not found your source? Fill a form and let us know! >>'}
          </a>
        </div>
      </div>
      {/* 填表环节 */}
      <div className="w-full h-1px bg-gray-3"> </div>
      <MatchConfig />
    </div>
  )
}

export default Match
