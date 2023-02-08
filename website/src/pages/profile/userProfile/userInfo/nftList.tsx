import React, { useEffect, useMemo, useState } from 'react'
import { getUserNfts } from '~/api/account'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import List from 'antd/es/list'
import VirtualList from 'rc-virtual-list'
import Empty from 'antd/es/empty'
import NFTItem from './nftItem'
import type { NFT } from '~/lib/types/app'

type AvatarListProps = {
  setChosenNft: Function
  chosenNft: NFT
  finnalAvatar: string
}

const AvatarList = (props: AvatarListProps) => {
  const { setChosenNft, chosenNft, finnalAvatar } = props
  const [nfts, setNfts] = useState<NFT[][]>([] as NFT[][])
  const [loading, setLoading] = useState<boolean>(false)
  const [cursor, setCursor] = useState('')
  const tempChosenNft = useMemo(() => JSON.parse(JSON.stringify(chosenNft)), [chosenNft])

  const handleChooseNFT = (e: any, nft: NFT) => {
    e.stopPropagation()
    if (nft?.metadata === chosenNft?.metadata) {
      setChosenNft({} as NFT)
    } else {
      setChosenNft(nft)
    }
  }

  const initNfts = async () => {
    setLoading(true)
    try {
      const result: any = await getUserNfts(cursor, 9)
      setCursor(result.cursor)
      // 还原总nft个数
      let originNfts = []
      for (let i = 0; i < nfts.length; i += 1) {
        originNfts.push(...nfts[i])
      }
      if (result?.result) {
        originNfts = originNfts.concat(result.result)
        // 三个nft一行
        const temp = []
        for (let i = 0; i < originNfts.length; i += 3) {
          temp.push(originNfts.slice(i, i + 3))
        }
        setNfts(temp)
      }
    } catch (error) {
      message.error('nft数据请求失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initNfts()
  }, [])

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 136) {
      if (cursor) {
        initNfts()
      } else {
        message.error('no more nfts~')
      }
    }
  }

  const computeIsChosen = (nft: NFT) => {
    if (tempChosenNft?.normalized_metadata?.name || tempChosenNft?.normalized_metadata?.image) {
      return tempChosenNft?.metadata === nft?.metadata
    }
    return finnalAvatar === nft?.normalized_metadata.image
  }

  return loading ? (
    <Skeleton />
  ) : (
    <>
      {nfts && nfts.length > 0 && (
        <List>
          <VirtualList data={nfts} height={412} itemHeight={136} itemKey="nft as avatar" onScroll={onScroll}>
            {(items: NFT[]) => (
              <List.Item key={items[0]?.normalized_metadata?.image} className="!justify-start">
                {items.map(nft => (
                  <NFTItem key={nft.normalized_metadata.name} nft={nft} isChosen={computeIsChosen(nft)} handleChooseNFT={handleChooseNFT} />
                ))}
              </List.Item>
            )}
          </VirtualList>
        </List>
      )}
      {(!nfts || nfts.length === 0) && <Empty />}
    </>
  )
}

export default AvatarList
