import fallbackImage from '~/assets/images/fallbackImage'
import { FinishedIcon } from '~/components/icon'
import Image from 'antd/es/image'
import type { NFT } from '~/lib/types/app'

type NFTItemProps = {
  isChosen: boolean
  nft: NFT
  handleChooseNFT: Function
}

const NFTItem: React.FC<NFTItemProps> = props => {
  const { isChosen, nft, handleChooseNFT } = props
  return (
    <div className="flex flex-col items-center justify-center mx-4" onClick={e => handleChooseNFT(e, nft)}>
      <div
        className={`flex flex-col border-2 cursor-pointer ${isChosen ? 'border-#6525FF bg-gray-100' : 'border-black'}`}
        style={{ width: 80, height: 80 }}
      >
        <div className="flex justify-end z-2" style={{ width: 80, height: 0, position: 'relative' }}>
          {isChosen && (
            <div style={{ position: 'absolute', top: '0px', right: '4px' }}>
              <FinishedIcon />
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Image
            preview={false}
            fallback={fallbackImage}
            src={nft.normalized_metadata.image}
            alt="nft"
            style={{ width: 80, height: 76 }}
            crossOrigin="anonymous"
          />
        </div>
      </div>
      <div
        className={`my-2 text-sm w-80px one-line-wrap ${isChosen ? 'text-#6525FF' : 'text-black'} cursor-pointer`}
        style={{ width: 80 }}
        title={nft.normalized_metadata.name || nft.name}
      >
        {nft.normalized_metadata.name || nft.name}
      </div>
    </div>
  )
}

export default NFTItem
