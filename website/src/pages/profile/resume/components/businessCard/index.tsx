import { message, QRCode } from 'antd';
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from '~/account'
import { useTranslation } from 'react-i18next';
import { DiscordIcon, EmailIcon } from '~/components/icon';
import { TwitterOutlined, WechatOutlined } from '@ant-design/icons';
import IconDeschool from '~/assets/icons/deschool.svg'
import CopyToClipboard from 'react-copy-to-clipboard';
import { useParams } from 'react-router';
import { getLatestUsers } from '~/api/booth';
import { getShortAddress } from '~/utils/format';


const BusinessCard = () => {
  const user = useAccount()
  const { t } = useTranslation()
  const [followings, setFollowings] = useState<number>()
  const [followers, setFollowers] = useState<number>(0)
  const { userId } = useParams()

  const contacts = useMemo(() => user?.contacts?.filter((item) => item.name) || [], [user])

  const fetchFollowInfo = async () => {
    if (!userId) {
      return
    }
    const u = await getLatestUsers({ userId })
    if (u.items.length > 0) {
      setFollowers(u.items[0].followerCount)
      setFollowings(u.items[0].followingCount)
    }
  }

  useEffect(() => {
    fetchFollowInfo()
  }, [])

  return (
    <div className='mx-auto mb-4 rounded-1 w-full min-w-327px bg-gradient-to-b from-#6525FF to-#9163FE text-white'>
      <div className='relative w-full mb-16px'>
        <img crossOrigin={user?.avatar?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"} src={user?.avatar} alt={user?.displayName} className="w-full aspect-[1/1]" />
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
        {/* eslint-disable-next-line no-nested-ternary */}
        {user?.displayName === user?.address ? getShortAddress(user?.address) : (user?.displayName && user?.displayName.length > 15 ? getShortAddress(user?.displayName) : user?.displayName)}

      </div>
      <div className='flex-1 frc-between w-full px-12px mb-34px'>
        <div className='flex-1'>
          <div className='text-18px font-ArchivoNarrow-Medium mb-2'>{user?.resumeInfo?.role}</div>
          <div className='frc-start'>
            <img crossOrigin={user?.resumeInfo?.project?.icon?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"} src={user?.resumeInfo?.project?.icon} alt="project icon" className='w-24px h-24px rounded-full mr-2' />
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
          <div className='text-16px'>
            <span className='text-#774FF8 mr-1 font-bold font-ArchivoNarrow-Medium'>{followers || '-'}</span>
            <span className='text-#181818A6'>{t('profile.followers')}</span>
          </div>
          <div className='w-3px h-28px bg-#18181840 rounded-4px mx-20px' />
          <div className='text-16px'>
            <span className='text-#774FF8 mr-1 font-bold font-ArchivoNarrow-Medium'>{followings || '-'}</span>
            <span className='text-#181818A6'>{t('profile.following')}</span>
          </div>
        </div>
      </div>
      <div className='frc-center pb-24px'>
        <img src={IconDeschool} alt="deschool" width={24} height={24} />
        <div className="ml-2 text-white text-16px font-ArchivoNarrow">DeSchool & Booth</div>
      </div>
    </div>
  )
}

export default BusinessCard
