import { message, QRCode } from 'antd';
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { DiscordIcon, EmailIcon } from '~/components/icon';
import { TwitterOutlined, WechatOutlined } from '@ant-design/icons';
import IconDeschool from '~/assets/icons/deschool.svg'
import CopyToClipboard from 'react-copy-to-clipboard';
import { useParams } from 'react-router';
import { getLatestUsers, getUserInfo } from '~/api/booth';
import { getShortAddress } from '~/utils/format';
import { UserInfo } from '~/api/booth/types';
import { useProfileResume } from '~/context/profile';

const BusinessCard = () => {
  const { t } = useTranslation()
  const [followings, setFollowings] = useState<number>()
  const [followers, setFollowers] = useState<number>(0)
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const {address } = useParams()
  const {project, role} = useProfileResume()

  const contacts = useMemo(() => currentUser?.contacts?.filter((item) => item.name) || [], [currentUser])

  const fetchUserInfoByAddress = async () => {
    const result = await getUserInfo(address)
    if (result?.displayName === address) {
      result.displayName = getShortAddress(address)
    }
    setCurrentUser(result)
    if (result?.id) {
      fetchFollowInfo(result.id)
    }
  }

  const fetchFollowInfo = async (userId: string) => {
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
    fetchUserInfoByAddress()
  }, [])

  return (
    <div className='mx-auto mb-4 rounded-1 w-full min-w-327px bg-gradient-to-b from-#6525FF to-#9163FE text-white'>
      <div className='relative w-full mb-16px'>
        <img crossOrigin={currentUser?.avatar?.includes('deschool.s3.amazonaws.com')?undefined:"anonymous"} src={currentUser?.avatar} alt={currentUser?.displayName} className="w-full aspect-[1/1]"/>
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
        {currentUser?.displayName === currentUser?.address ? currentUser?.address : currentUser?.displayName}
      </div>
      <div className='flex-1 frc-between w-full px-12px mb-34px'>
        <div className='flex-1'>
          <div className='text-18px font-ArchivoNarrow-Medium mb-2'>{role}</div>
          <div className='frc-start'>
            <img crossOrigin={project?.icon?.includes('deschool.s3.amazonaws.com')?undefined:"anonymous"} src={project?.icon} alt="project icon" className='w-24px h-24px rounded-full mr-2'/>
            <div className='font-ArchivoNarrow-Semibold'>{project?.name}</div>
          </div>
        </div>
        <QRCode
          errorLevel="M"
          size={80}
          color="#333333"
          bordered={false}
          value={`${location.origin}/profile/${currentUser?.address}/resume/${currentUser?.id}`}
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
