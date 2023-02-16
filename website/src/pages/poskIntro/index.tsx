import React, { useEffect, useState } from 'react'

import JumpIcon from '~/assets/icons/jump.png'
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined'
import fallbackImage from '~/assets/images/fallbackImage'

import message from 'antd/es/message'
import Skeleton from 'antd/es/skeleton'
import Image from 'antd/es/image'
import Tag from 'antd/es/tag'
import List from 'antd/es/list'
import Empty from 'antd/es/empty'
import ShowMoreLoading from '~/components/loading/showMore'

import { useNavigate, useParams } from 'react-router'
import { useAccount } from '~/context/account'
import { useTranslation } from 'react-i18next'
import type { SBTDetailResult, SBTMeta } from '~/api/booth/booth'
import { getSbtDetail } from '~/api/booth/booth'
import Jazzicon from 'react-jazzicon'
import OwnersOnLens from './owners'

// 骨架屏
const PoskIntroSkeleton = () => (
  <div className="w-full h-auto overflow-auto flex items-center justify-center">
    <div className="relative w-full max-w-1200px overflow-hidden font-ArchivoNarrow">
      <Skeleton.Button style={{ width: '1200px', height: '60px' }} />
      <div className="frc-center mt-16">
        <Skeleton.Image className="mr-2 w-200px h-200px md:w-140px md:h-140px" />
        <Skeleton />
      </div>
      <div className="frc-start mt-16 mb-4">
        <Skeleton.Button style={{ width: '200px', height: '60px' }} />
      </div>
      <div className="frc-start">
        <Skeleton.Image className="mr-2 w-80px h-80px" />
        <Skeleton />
      </div>
      <div className="frc-start">
        <Skeleton.Image className="mr-2 w-80px h-80px" />
        <Skeleton />
      </div>
      <div className="frc-start">
        <Skeleton.Image className="mr-2 w-80px h-80px" />
        <Skeleton />
      </div>
    </div>
  </div>
)

const PoskIntro = () => {
  const { contractAddress, tokenId } = useParams()
  const user = useAccount()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [poskInfo, setPoskInfo] = useState<SBTMeta>({} as SBTMeta)
  const [owners, setOwners] = useState<string[]>([] as string[])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState<number>(1)

  const initPoskInfo = async () => {
    if (owners.length > 0) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    try {
      if (contractAddress && tokenId) {
        const res: SBTDetailResult | undefined = await getSbtDetail(contractAddress!, tokenId)
        if (res && res.Metadata) {
          setPoskInfo(res.Metadata)
        }
        if (res && res.Owners && res.Owners.length > 0) {
          setTotal(res.Owners.length)
          setPage(page + 1)
          const temp = owners.concat(res.Owners)
          setOwners(temp)
        }
      } else {
        message.error('地址栏SBT参数不全,合约地址和TokenId不可为空')
      }
    } catch (error: any) {
      message.error(error)
    } finally {
      setLoadingMore(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    initPoskInfo()
  }, [user])

  const handleJump = () => {
    const { contractAddr } = poskInfo
    const id = poskInfo.tokenId
    if (contractAddr && tokenId) {
      window.open(`https://opensea.io/assets/matic/${contractAddr}/${id}`, '_blank')
    } else {
      message.error('metadata is error')
    }
  }

  const handleVisitProfile = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, owner: string) => {
    e?.stopPropagation()
    if (!owner) {
      return
    }
    navigate(`/profile/${owner}`)
  }

  const handleAddMore = async () => {
    await initPoskInfo()
  }

  return loading ? (
    <PoskIntroSkeleton />
  ) : (
    <div className="w-full h-auto overflow-auto flex items-center justify-center">
      <div className="relative w-full max-w-1200px scroll-hidden font-ArchivoNarrow mb-10">
        {/* 导航回退 */}
        <div
          className="flex items-center mt-2 py-2 text-black hover:text-#6525ff"
          onClick={() => {
            history.back()
          }}
        >
          <ArrowLeftOutlined style={{ fontSize: '26px' }} className="cursor-pointer p-1 border-3 border-current rounded-full" />
          <span className="text-3xl ml-4 cursor-pointer">{t('back')}</span>
        </div>
        {/* posk信息 */}
        <div className="relative w-full h-auto flex flex-col justify-around scroll-hidden font-ArchivoNarrow">
          <div className="flex flex-col items-start md:flex-row md:items-center mt-24px bg-#1818180f rounded p-32px">
            {poskInfo?.image ? (
              <>
                <div className="fcc-center">
                  <Image
                    src={poskInfo.image}
                    fallback={fallbackImage}
                    style={{ width: '100%', height: '100%' }}
                    className="object-contain object-center"
                    wrapperClassName="mr-2 border-#1818180f border border-solid w-200px h-200px md:w-160px md:h-160px"
                  />

                  <div className="frc-center mt-2 ">
                    {poskInfo.contractType && (
                      <Tag color="#dddddd" className="rounded h-30px leading-30px text-gray-5!">
                        {poskInfo.contractType}
                      </Tag>
                    )}
                    <div>
                      <Tag className="frc-center rounded-2 cursor-pointer py-1 px-2 hover:bg-purple-100" onClick={handleJump}>
                        <span className="mr-2 ">OpenSea</span>
                        <img alt="jump icon" src={JumpIcon} />
                      </Tag>
                    </div>
                  </div>
                </div>

                <div className="fcs-between h-full ml-2 flex-1 overflow-hidden">
                  <p className="text-#6525FF text-3xl font-ArchivoNarrow text-center mt-8 md:m-0 font-wrap">{poskInfo?.name}</p>
                  <p
                    className="text-black text-2xl font-ArchivoNarrow md:m-0 text-justify overflow-auto scroll-hidden"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {poskInfo?.description}
                  </p>
                </div>
              </>
            ) : (
              <Empty className="w-full" />
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-10">{t('posk.lensmate')}</h1>
        <OwnersOnLens owners={owners} />
        {/* 关联拥有者 */}
        <h1 className="text-2xl font-bold mt-10">{t('posk.mate')}</h1>
        {owners && owners.length > 0 && (
          <List className="mt-4 rounded  bg-#1818180f">
            {owners.map(owner => (
              <List.Item key={`${owner}`} className="!justify-start hover:bg-#1818180f">
                <div className="w-full flex flex-row justify-between items-center font-ArchivoNarrow">
                  <div className="frc-start">
                    <div
                      onClick={(e: any) => {
                        handleVisitProfile(e, owner)
                      }}
                    >
                      <Jazzicon diameter={64} seed={Math.floor(Math.random()*10000)} />
                    </div>
                    <div className="flex flex-col ml-6 flex-1 overflow-hidden">
                      <span
                        className="mr-4 text-xl font-bold line-wrap one-line-wrap cursor-pointer"
                        onClick={e => {
                          e?.preventDefault()
                          handleVisitProfile(e, owner)
                        }}
                      >
                        {owner}
                      </span>
                    </div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        )}
        {loadingMore && (
          <div className="mt-10 w-full frc-center">
            <ShowMoreLoading />
          </div>
        )}
        {owners && owners.length > 0 && total > owners.length && (
          <div className="text-center mt-10">
            <button
              type="button"
              className={`bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2 ${loadingMore ? 'cursor-not-allowed' : ''}`}
              onClick={handleAddMore}
            >
              {t('SeeMore')}
            </button>
          </div>
        )}
        {(!owners || owners.length === 0) && <Empty />}
      </div>
    </div>
  )
}

export default PoskIntro
