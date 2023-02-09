import React, { useEffect, useState } from 'react'
import JumpIcon from '~/assets/icons/jump.png'
import message from 'antd/es/message'
import Skeleton from 'antd/es/skeleton'
import Image from 'antd/es/image'
import Avatar from 'antd/es/avatar'
import Tag from 'antd/es/tag'
import { useNavigate, useParams } from 'react-router'
import { useAccount } from '~/context/account'
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined'
import { useTranslation } from 'react-i18next'
import fallbackImage from '~/assets/images/fallbackImage'
import { getSbtInfoById, getPassInfoById } from '~/api/sbt'
import List from 'antd/es/list'
import Empty from 'antd/es/empty'
import ShowMoreLoading from '~/components/loading/showMore'
import type { Pass } from '~/lib/types/app'

type OwnerRecord = {
  id: string
  address?: string
  username?: string
  avatar: string
  introduction?: string
  bio?: string
  ownerAt?: string
  sbtCount?: number
}

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
  const { sbtId, passId } = useParams()
  const user = useAccount()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [poskInfo, setPoskInfo] = useState<Pass>({} as Pass)
  const [owners, setOwners] = useState<OwnerRecord[]>([] as OwnerRecord[])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const isFromSbt = window.location.pathname.includes('sbtIntro')

  const initPoskInfo = async () => {
    if (owners.length > 0) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    try {
      let res: any
      if (isFromSbt) {
        res = await getSbtInfoById(sbtId!, 6, page)
      } else {
        res = await getPassInfoById(passId!, 6, cursor.toString())
      }
      if (res) {
        setTotal(res.totalCount)
        if (isFromSbt) {
          setPage(page + 1)
          setPoskInfo({ ...res, title: res.name, passShow: res.url })
        }
        // else if (poskInfo.type === 'extrapass') {
        //   setCursor(res.cursor)
        //   setPoskInfo({ ...res, title: res.name, passShow: ExtraImage })
        // }
        else {
          setCursor(res.cursor)
          setPoskInfo({ ...res, title: res.name })
        }
        const temp = owners.concat(res.owners)
        setOwners(temp)
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
    const { contractAddr, tokenId } = poskInfo
    if (contractAddr && tokenId) {
      window.open(`https://opensea.io/assets/matic/${contractAddr}/${tokenId}`, '_blank')
    } else {
      message.error('metadata is error')
    }
  }

  const handleVisitProfile = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, owner: OwnerRecord, initTab?: boolean) => {
    e?.stopPropagation()
    if (!owner.id) {
      return
    }
    if (initTab && isFromSbt) {
      localStorage.setItem('pfTab', '2')
    }
    navigate(`/profile/${owner.id}`)
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
            <div className="fcc-center">
              <Image
                src={poskInfo.passShow}
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
                {poskInfo.type !== 'extrapass' && (
                  <div>
                    <Tag className="frc-center rounded-2 cursor-pointer py-1 px-2 hover:bg-purple-100" onClick={handleJump}>
                      <span className="mr-2 ">OpenSea</span>
                      <img alt="jump icon" src={JumpIcon} />
                    </Tag>
                  </div>
                )}
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
          </div>
        </div>
        {/* 关联拥有者 */}
        <h1 className="text-2xl font-bold mt-10">{t('profile.mate')}</h1>
        {owners && owners.length > 0 && (
          <List className="mt-4 py-6">
            {owners.map(owner => (
              <List.Item key={`${owner.id}${owner.avatar}`} className="!justify-start hover:bg-#1818180f">
                <div className="w-full flex flex-row justify-between items-center font-ArchivoNarrow">
                  <div className="frc-start">
                    <Avatar
                      shape="circle"
                      src={owner.avatar ? owner.avatar : fallbackImage}
                      className="mr-2 w-64px h-64px cursor-pointer"
                      size={64}
                      onClick={e => {
                        handleVisitProfile(e, owner)
                      }}
                    />
                    <div className="flex flex-col ml-6 flex-1 overflow-hidden">
                      <span
                        className="mr-4 text-xl font-bold one-line-wrap cursor-pointer"
                        onClick={e => {
                          e?.preventDefault()
                          handleVisitProfile(e, owner)
                        }}
                      >
                        {owner.username}
                      </span>
                      {/* <span className="mr-4 text-xl font-bold one-line-wrap">{getShortAddress(owner.address)}</span> */}
                      <span>{owner.bio}</span>
                    </div>
                  </div>
                  <div
                    className={`${owner.sbtCount !== 0 ? 'cursor-pointer block' : 'hidden'}`}
                    onClick={e => handleVisitProfile(e, owner, true)}
                  >
                    {t('own')}
                    <span className="mx-2">{owner.sbtCount}</span>Posks
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
