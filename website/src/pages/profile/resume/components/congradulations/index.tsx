import Alert from 'antd/es/alert'
import { useAccount } from '~/context/account'

const BOOTH_PATH = import.meta.env.VITE_APP_BOOTH_PATH

type CongradulationsProps = {
  type: 'Lens' | 'CyberConnect'
  txHash: string
}

const CHECK_URL = {
  Lens: 'https://polygonscan.com/tx/',
  CyberConnect: import.meta.env.MODE === 'production' ? 'https://bscscan.com/tx/' : 'https://testnet.bscscan.com/tx/',
}

const VISIT_URL = {
  Lens: 'https://lenster.xyz/u/',
  CyberConnect: 'https://arweave.net/',
}

const Congradulations: React.FC<CongradulationsProps> = (props) => {
  const { txHash, type } = props
  const { lensProfile, lensToken, cyberToken, deschoolProfile } = useAccount()
  const visitContent = () => {
    if (type === 'Lens') {
      return `${VISIT_URL[type]}${lensProfile?.handle}`
    }
    return `${VISIT_URL[type]}${txHash}`
  }
  return (
    <div className="w-full">
      <h1 className="text-2xl font-Anton">Congradulations! 🎉</h1>
      <p className="font-ArchivoNarrow mt-6">Your first web3 resume is published! Hooray!</p>
      <p className="font-ArchivoNarrow mt-1">
        Thanks for using Booth to create your resume in a web3-enabled way! We hope this decentralized approach will help you stand
        out in your job search :)
      </p>
      <p className="font-ArchivoNarrow">Now you can: </p>
      <ol>
        <li className="font-ArchivoNarrow mt-1">
          1. Check{' '}
          <a href={`${CHECK_URL[type]}${txHash}`} target="_blank" rel="noreferrer" className="color-#774FF8">
            { type === 'Lens' ? 'PolygonScan' : 'BscScan'}
          </a>{' '}
          to check transaction
        </li>
        <li className="font-ArchivoNarrow mt-1">
          2. Visit{' '}
          <a href={visitContent()} target="_blank" rel="noreferrer" className="color-#774FF8">
            { type === 'Lens' ? 'Lenster' : 'Arweave'}
          </a>{' '}
          to view your resume, it should update in your feeds as a post in 10 seconds.{' '}
        </li>
        <li className="font-ArchivoNarrow mt-1">
          3. Send your resume to someone (for work or just show off!) and invite more friends to this cool website with your unique
          rerferral link:
          <Alert
            className="mt-1!"
            message={
              <div className="font-ArchivoNarrow ">{`${BOOTH_PATH}?inviter=${(type === 'Lens' ? lensToken?.address : cyberToken?.address) || deschoolProfile?.address}`}</div>
            }
            type="info"
          />
        </li>
      </ol>
    </div>
  )
}

export default Congradulations
