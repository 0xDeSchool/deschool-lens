import { useEffect, useMemo, useState } from 'react'

import message from 'antd/es/message'
import Skeleton from 'antd/es/skeleton'
import { useTranslation } from 'react-i18next'
import { followUser, unfollowUser } from '~/api/booth/follow'
import Button from 'antd/es/button';
import QRCode from 'antd/es/qrcode';
import IconDeschool from '~/assets/icons/deschool.svg'
import { getShortAddress } from '~/utils/format';
import BusinessCard from '../resume/components/businessCard/genCard';
import DeschoolFollowersModal from './deschoolModal'
import { useProfileResume } from '~/context/profile';
import { DEFAULT_AVATAR, useAccount } from '~/account';
import ResumeContacts from '~/components/contacts'

type DeschoolCardProps = {
  visitCase: 0 | 1 | -1 // 0-自己访问自己 1-自己访问别人
  routeAddress: string | undefined // 父组件希望展示的地址，如果为空则展示登录者自己信息
}

// 0-自己访问自己 1-自己访问别人
const DeschoolCard = (props: DeschoolCardProps) => {
  const { visitCase, routeAddress } = props
  const [modal, setModal] = useState<{ type: 'followers' | 'following'; visible: boolean }>({ type: 'followers', visible: false })
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const { t } = useTranslation()
  const account = useAccount()
  const { loading, project, role, followings, followers, user, refreshUserInfo } = useProfileResume()
  // 根据不同情况初始化用户信息

  const contacts = useMemo(() => {
    return user?.contacts?.filter((item) => !!item.url) || []
  }, [user?.contacts])

  useEffect(() => {
    setModal({ type: 'followers', visible: false })
  }, [routeAddress])

  useEffect(() => {
    if (updateTrigger > 0) {
      setModal({
        type: 'followers',
        visible: false,
      })
      refreshUserInfo()
    }
  }, [updateTrigger, visitCase, account])

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
    setIsFollowLoading(true)
    await followUser(user?.id!, account?.id!)
    message.success(`success following ${user?.address}`)
    setUpdateTrigger(new Date().getTime())
    setIsFollowLoading(false)
    refreshUserInfo()
  }

  const handleUnFollow = async () => {
    setIsFollowLoading(true)
    await unfollowUser(user?.id!, account?.id!)
    message.success(`success unfollow ${user?.address}`)
    setUpdateTrigger(new Date().getTime())
    setIsFollowLoading(false)
    refreshUserInfo()
  }

  if (loading) {
    return (<div className="h-400px fcc-center">
      <Skeleton active />
    </div>)
  }

  return (
    <>
      <div className='h-100% mx-auto pb-4 rounded-1 w-full min-w-327px bg-gradient-to-b from-#6525FF to-#9163FE text-white'>
        <div className='relative w-full mb-16px'>
          {user?.avatar ? <img
            crossOrigin={user?.avatar?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"}
            src={user?.avatar}
            alt={user?.displayName}
            className="w-full aspect-[1/1] rounded-t-1" />
            : <img
            src={DEFAULT_AVATAR}
            alt={user?.displayName}
            className="w-full aspect-[1/1] rounded-t-1" />}
          <ResumeContacts contacts={contacts}/>
        </div>
        <div className='text-28px font-Anton px-12px mb-4'>
          {/* eslint-disable-next-line no-nested-ternary */}
          {user?.displayName === user?.address ? getShortAddress(user?.address) : (user?.displayName && user?.displayName.length > 15 ? getShortAddress(user?.displayName) : user?.displayName)}
        </div>
        <div className='flex-1 frc-between w-full px-12px mb-34px'>
          <div className='flex-1'>
            <div className='text-24px font-ArchivoNarrow-Medium mb-2'>{role}</div>
            <div className='frc-start'>
              {project?.icon && <img crossOrigin={project?.icon?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"}
                src={project?.icon}
                alt="project icon"
                className='w-24px h-24px rounded-full mr-2' />}
              <div className='text-18px font-ArchivoNarrow-Semibold'>{project?.name}</div>
            </div>
          </div>
          {visitCase !== -1 && <QRCode
            size={120}
            color="#333333"
            bordered={false}
            value={`${location.origin}/resume/${user?.address}`}
            style={{ border: 'none', borderRadius: '4px', padding: 0, margin: 0 }}
          />}
        </div>
        <div className='w-full px-12px frc-center mb-24px'>
          <div className='w-full h-52px frc-center rounded-4px bg-white'>
            <div className={`text-16px ${followers > 0 ? 'hover:underline hover:cursor-pointer' : ''}`} onClick={() => {
              handleJumpFollowers(followers)
            }}>
              <span className='text-#774FF8 mr-1 font-bold font-ArchivoNarrow-Medium'>{followers || '-'}</span>
              <span className='text-#181818A6'>{t('profile.followers')}</span>
            </div>
            <div className='w-3px h-28px bg-#18181840 rounded-4px mx-20px' />
            <div className={`text-16px ${followings > 0 ? 'hover:underline hover:cursor-pointer' : ''}`} onClick={() => {
              handleJumpFollowing(followings)
            }}>
              <span className='text-#774FF8 mr-1 font-bold font-ArchivoNarrow-Medium'>{followings || '-'}</span>
              <span className='text-#181818A6'>{t('profile.following')}</span>
            </div>
          </div>
        </div>
        {visitCase === 0 && (<div className='frc-center w-full mb--20px'><BusinessCard /></div>)}
        {(routeAddress && account?.address && visitCase === 1) && (
          <div className="px-10 py-4 text-right">
            <Button
              className="purple-border-button px-2 py-1 font-ArchivoNarrow text-white"
              disabled={!account || routeAddress === account?.address}
              style={{ color: '#fff', borderColor: '#fff' }}
              loading={isFollowLoading}
              onClick={() => {
                if (user?.isFollowedByMe) {
                  handleUnFollow()
                } else if (user) {
                  handleFollow()
                }
              }}
            >
              {user?.isFollowedByMe ? t('UnFollow') : t('Follow')}
            </Button>
          </div>
        )}
      </div>
      <DeschoolFollowersModal
        userId={user?.id}
        type={modal.type}
        visible={modal.visible}
        closeModal={closeModal}
        setUpdateTrigger={setUpdateTrigger}
      />
    </>
  )
}

export default DeschoolCard
