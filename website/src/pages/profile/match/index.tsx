import { useState } from 'react'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import MatchConfig from './MatchConfig'
import TalentRadar from './TalentRadar'

const Match = () => {
  const [loading, setLoading] = useState(false)

  return (
    <div className="w-full fcc-start">
      <h1 className="text-2xl font-bold font-ArchivoNarrowBold">Match Your Potential Friends / Partners</h1>
      <TalentRadar />
      <div className="w-full text-center">
        <h1>You can gain perks by connecting trusted education and career credential providers:</h1>
        <div className="frc-center my-4">
          <button type="button" className="purple-border-button p-2 mr-4">
            {loading ? (
              <div className="loading ml-2">
                <LoadingOutlined color="#6525FF" style={{ width: 20, height: 20, fontSize: 20 }} />
              </div>
            ) : (
              <span>Connect Deschool</span>
            )}
          </button>
          <button type="button" className="purple-border-button p-2">
            <span>Connect Professional</span>
          </button>
        </div>
        <p className="w-full text-center text-gray-5 text-14px">Not found your source? Fill a form and let us know!</p>
      </div>
      <div className="w-full h-1px bg-gray-3"> </div>
      <MatchConfig />
    </div>
  )
}

export default Match
