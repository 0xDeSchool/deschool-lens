import { useEffect, useMemo, useState } from 'react'

import message from 'antd/es/message'
import Skeleton from 'antd/es/skeleton'
import { useTranslation } from 'react-i18next'
import type { FollowRelationType } from '~/api/booth/follow';
import { getFollowings, getFollowers, followUser, unfollowUser, checkfollowUser } from '~/api/booth/follow'
import { useAccount } from '~/account'
import type { UserFollower, UserFollowing, UserInfo } from '~/api/booth/types';
import { getUserInfo } from '~/api/booth';
import Button from 'antd/es/button';
import QRCode from 'antd/es/qrcode';
import CopyToClipboard from 'react-copy-to-clipboard';
import { DiscordIcon, EmailIcon } from '~/components/icon';
import { TwitterOutlined, WechatOutlined } from '@ant-design/icons';
import IconDeschool from '~/assets/icons/deschool.svg'
import BusinessCard from '../resume/components/businessCard/genCard';
import DeschoolFollowersModal from './deschoolModal'

type DeschoolCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

// 0-自己访问自己 1-自己访问别人
const DeschoolCard = (props: DeschoolCardProps) => {
  const { visitCase, routeAddress } = props
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false)
  const [followings, setFollowings] = useState<UserFollowing[]>([])
  const [followers, setFollowers] = useState<UserFollower[]>([])
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const { t } = useTranslation()
  const user = useAccount()

  const contacts = useMemo(() => user?.contacts?.filter((item) => item.name) || [], [user])

  // 根据不同情况初始化用户信息
  const initUserInfo = async () => {
    setLoading(true)
    try {
      switch (visitCase) {
        // 访问自己的空间
        case 0:
          if (user) {
            const resFollowings = await getFollowings(user.id)
            if (resFollowings) {
              setFollowings(resFollowings)
            }
            const resFollowers = await getFollowers(user.id)
            if (resFollowers) {
              setFollowers(resFollowers)
            }
            setCurrentUser(user)
          }
          break
        // 访问他人的空间
        case 1: {
          const userInfo = await getUserInfo(routeAddress) // 此case下必不为空
          if (userInfo) {
            setCurrentUser({
              id: userInfo.id,
              address: userInfo.address,
              avatar: userInfo.avatar,
              bio: userInfo.bio,
              displayName: userInfo.displayName,
            })
            const resFollowings = await getFollowings(userInfo.id, user?.id)
            if (resFollowings) {
              setFollowings(resFollowings)
            }
            const resFollowers = await getFollowers(userInfo.id, user?.id)
            if (resFollowers) {
              setFollowers(resFollowers)
            }

            // 我登录了
            if (user) {
              const isFollowed: FollowRelationType | any = await checkfollowUser(userInfo.id, user.id)
              setIsFollowedByMe(isFollowed.fromFollowedTo || false) // 我A(from)=>他人B(to)
            }
            // 没登录
            else {
              setIsFollowedByMe(false)
            }
          }

          break
        }
        default:
          setIsFollowedByMe(false)
          setFollowers([])
          setFollowings([])
          setCurrentUser(null)
          break
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setModal({ type: 'followers', visible: false })
  }, [routeAddress])

  useEffect(() => {
    initUserInfo()
    if (updateTrigger > 0) {
      setModal({
        type: 'followers',
        visible: false,
      })
    }
  }, [updateTrigger, visitCase, user])

  const handleJumpFollowers = (num: number | undefined) => {
    if (num && num > 0) {
      setModal({
        type: 'followers',
        visible: true,
      })
    }
  }
  const handleJumpFollowing = (num: number | undefined) => {
    if (num && num > 0) {
      setModal({
        type: 'following',
        visible: true,
      })
    }
  }

  const closeModal = () => {
    setModal({
      type: modal.type,
      visible: false,
    })
  }

  const handleFollow = async () => {
    await followUser(currentUser?.id!, user?.id!)
    message.success(`success following ${currentUser?.address}`)
    setUpdateTrigger(new Date().getTime())
  }

  const handleUnFollow = async () => {
    await unfollowUser(currentUser?.id!, user?.id!)
    message.success(`success unfollow ${currentUser?.address}`)
    setUpdateTrigger(new Date().getTime())
  }

  if (loading) {
    return (<div className="h-400px fcc-center">
      <Skeleton active />
    </div>)
  }

  return (
    <div >
      <div className='mx-auto mb-4 rounded-1 w-full min-w-327px bg-gradient-to-b from-#6525FF to-#9163FE text-white'>
      <div className='relative w-full mb-16px'>
        <img crossOrigin={user?.avatar?.includes('deschool.s3.amazonaws.com')?undefined:"anonymous"} src={user?.avatar} alt={user?.displayName} className="w-full aspect-[1/1]"/>
        <div className='absolute left-0 bottom-0 right-0 z-1 w-full h-48px frc-center gap-4 bg-#18181826 backdrop-blur-sm'>
          {contacts?.map((item, index) => (
              <>
                <CopyToClipboard
                  text={item.name}
                  onCopy={() => {
                    message.success('Copied')
                  }}
                >
                  <div key={item.contactType} className="frc-center">
                    {item.contactType === 'Discord' && <DiscordIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                    {item.contactType === 'Twitter' && <TwitterOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                    {item.contactType === 'Wechat' && <WechatOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                    {item.contactType === 'Email' && <EmailIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                    {/* <span className='ml-2 text-14px'>@{item.name}</span> */}
                  </div>
                </CopyToClipboard>
                {index < contacts.length - 1 && <div className='w-1px h-13px bg-#FFFFFF73' />}
              </>
            ))}
        </div>
      </div>
      <div className='text-28px font-Anton px-12px mb-4'>
        {user?.displayName === user?.address ? user?.address : user?.displayName}
      </div>
      <div className='flex-1 frc-between w-full px-12px mb-34px'>
        <div className='flex-1'>
          <div className='text-18px font-ArchivoNarrow-Medium mb-2'>{user?.resumeInfo?.role}</div>
          <div className='frc-start'>
            <img crossOrigin={user?.resumeInfo?.project?.icon?.includes('deschool.s3.amazonaws.com')?undefined:"anonymous"} src={user?.resumeInfo?.project?.icon} alt="project icon" className='w-24px h-24px rounded-full mr-2'/>
            <div className='font-ArchivoNarrow-Semibold'>{user?.resumeInfo?.project?.name}</div>
          </div>
        </div>
        <QRCode
          errorLevel="M"
          size={80}
          color="#333333"
          bordered={false}
          value={`${location.origin}/profile/${user?.address}/resume/${user?.id}`}
          style={{ border: 'none', borderRadius: '4px', padding: 0, margin: 0, height: '80px', width: '80px' }}
        />
      </div>
      <div className='w-full px-12px frc-center mb-24px'>
        <div className='w-full h-52px frc-center rounded-4px bg-white'>
          <div className={`text-16px ${followers?.length > 0 ? 'hover:underline hover:cursor-pointer' : ''}`} onClick={() => {
              handleJumpFollowers(followers?.length)
            }}>
            <span className='text-#774FF8 mr-1 font-bold font-ArchivoNarrow-Medium'>{followers?.length || '-'}</span>
            <span className='text-#181818A6'>{t('profile.followers')}</span>
          </div>
          <div className='w-3px h-28px bg-#18181840 rounded-4px mx-20px' />
          <div className={`text-16px ${followings?.length > 0 ? 'hover:underline hover:cursor-pointer' : ''}`} onClick={() => {
              handleJumpFollowing(followings?.length)
            }}>
            <span className='text-#774FF8 mr-1 font-bold font-ArchivoNarrow-Medium'>{followings?.length || '-'}</span>
            <span className='text-#181818A6'>{t('profile.following')}</span>
          </div>
        </div>
      </div>
      <div className='frc-center pb-24px'>
        <img src={IconDeschool} alt="deschool" width={24} height={24} />
        <div className="ml-2 text-white text-16px font-ArchivoNarrow">DeSchool & Booth</div>
      </div>
      {visitCase === 0 && (<div className='frc-center w-full mb--20px'><BusinessCard /></div>)}
      {routeAddress && (
          <div className="m-10 text-right">
            <Button
              className="purple-border-button px-2 py-1 font-ArchivoNarrow"
              disabled={!user || routeAddress === user?.address}
              onClick={() => {
                if (isFollowedByMe && currentUser) {
                  handleUnFollow()
                } else if (currentUser) {
                  handleFollow()
                }
              }}
            >
              {isFollowedByMe ? t('UnFollow') : t('Follow')}
            </Button>
          </div>
        )}
    </div>
      <DeschoolFollowersModal
        type={modal.type}
        visible={modal.visible}
        closeModal={closeModal}
        followings={followings}
        followers={followers}
        setUpdateTrigger={setUpdateTrigger}
      />
    </div>
  )
}

export default DeschoolCard
