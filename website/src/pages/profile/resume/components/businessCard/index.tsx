import Button from 'antd/es/button'
import Modal from 'antd/es/modal/Modal'
import { message, QRCode } from 'antd';
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from '~/account'
import html2canvas from 'html2canvas';
import { download } from '~/utils';
import { useTranslation } from 'react-i18next';
import { DiscordIcon, EmailIcon } from '~/components/icon';
import { TwitterOutlined, WechatOutlined } from '@ant-design/icons';
import IconDeschool from '~/assets/icons/deschool.svg'
import CopyToClipboard from 'react-copy-to-clipboard';
import { UserFollower, UserFollowing } from '~/api/booth/types';
import { useParams } from 'react-router';
import { getLatestUsers } from '~/api/booth';


const BusinessCard = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = useAccount()
  const { t } = useTranslation()
  const [resumeCardUrl, setResumeCardUrl] = useState('')
  const [followings, setFollowings] = useState<number>()
  const [followers, setFollowers] = useState<number>(0)
  const {userId } = useParams()

  const contacts = useMemo(() => {
    return user?.contacts?.filter((item) => item.name) || []
  }, [user])

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

  const cacheImage = (src: string) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous'
      img.onload = (blob) => {
        console.log('图片加载成功', blob)
        resolve('');
      };
      img.onerror = (e) => {
        console.log(e);
        reject(new Error('图片加载失败'));
      };
      img.src = src;
    });
  }

  const handleOk = () => {
    if (!user?.avatar) {
      return
    }
    setLoading(true)
    cacheImage(user?.avatar).then(() => {
      html2canvas(document.querySelector('.business-card')!, { useCORS: true }).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob === null) return;
          const url = URL.createObjectURL(blob);
          setResumeCardUrl(url)
          download(url, `${user?.displayName}-business-card.png`)
          setLoading(false)
          // 释放URL对象
          // URL.revokeObjectURL(url);
          message.success(t('saveSuccess'))
        }, 'image/png');
      });
    })
  }

  const handleGenerate = () => {
    setOpen(true)
  }

  useEffect(() => {
    fetchFollowInfo()
  }, [])

  return (
    <>
    <div onClick={handleGenerate} className='mx-auto w-327px min-w-327px bg-gradient-to-b from-#6525FF to-#9163FE drop-shadow-md shadow-md text-white' style={{boxShadow: 'inset 0px 0px 20px rgba(119, 79, 248, 0.1)'}}>
      <div className='relative w-327px h-327px mb-16px'>
        <img crossOrigin="anonymous" src={user?.avatar} alt={user?.displayName} className="w-327px h-327px"/>
        <div className='absolute left-0 bottom-0 right-0 z-1 w-full h-48px frc-center gap-4 bg-#18181826'>
          {contacts?.map((item, index) => {
            return (
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
                {index < contacts.length - 1 && <div className='w-1px h-13px bg-#FFFFFF73'></div>}
              </>
            )
          })}
        </div>
      </div>
      <div className='text-28px font-Anton px-12px mb-4'>
        {user?.displayName === user?.address ? user?.address : user?.displayName}
      </div>
      <div className='flex-1 frc-between w-full px-12px mb-34px'>
        <div className='flex-1'>
          <div className='text-18px font-ArchivoNarrow-Medium mb-2'>{user?.resumeInfo?.role}</div>
          <div className='frc-start'>
            <img crossOrigin="anonymous" src={user?.resumeInfo?.project?.icon} alt="project icon" className='w-24px h-24px rounded-full mr-2'/>
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
          <div className='w-3px h-28px bg-#18181840 rounded-4px mx-20px'></div>
          <div className='text-16px'>
            <span className='text-#774FF8 mr-1 font-bold font-ArchivoNarrow-Medium'>{followings || '-'}</span>
            <span className='text-#181818A6'>{t('profile.following')}</span>
          </div>
        </div>
      </div>
      <div className='frc-center pb-24px'>
        <img src={IconDeschool} alt="deschool" width={24} height={24} />
        <div className={`ml-2 text-white text-16px font-ArchivoNarrow`}>DeSchool & Booth</div>
      </div>
    </div>
    <Modal
      wrapClassName=""
      open={open}
      width='800px'
      title={null}
      footer={null}
      closable={false}
      centered
      closeIcon={null}
      style={{ height: '60vh' }}
      destroyOnClose
      onCancel={() => {
        setOpen(false)
      }}
      afterClose={() => {
        setOpen(false)
      }}
    >
      <div className='frc-between'>
        <div className='business-card w-327px min-w-327px h-734px bg-gradient-to-b from-#6525FF to-#9163FE drop-shadow-md shadow-md text-white'>
          <img crossOrigin="anonymous" src={user?.avatar} alt={user?.displayName} className="w-327px h-327px mb-16px"/>
          <div className='text-28px font-Anton px-12px mb-4'>
            {user?.displayName === user?.address ? user?.address : user?.displayName}
          </div>
          <div className='flex-1 frc-between w-full px-12px mb-34px'>
            <div className='flex-1'>
              <div className='text-18px font-ArchivoNarrow-Medium mb-2'>{user?.resumeInfo?.role}</div>
              <div className='frc-start'>
                <img src={user?.resumeInfo?.project?.icon} alt="project icon" className='w-24px h-24px rounded-full mr-2'/>
                <div className='font-ArchivoNarrow-Semibold'>{user?.resumeInfo?.project?.name}</div>
              </div>
            </div>
            <div className='w-80px h-80px self-end preload-resume-qrcode'>
              <QRCode
                errorLevel="M"
                size={80}
                color="#333333"
                bordered={false}
                value={`${location.origin}/profile/${user?.address}/resume/${user?.id}`}
                style={{ border: 'none', borderRadius: '4px', padding: 0, margin: 0, height: '80px', width: '80px' }}
              />
            </div>
          </div>
          <div className='w-full grid grid-cols-2 gap-2 font-ArchivoNarrow px-12px'>
            {contacts?.map((item) => {
              return (
                <div key={item.contactType} className="frc-center h-43px w-full rounded-2 border-2 border-#FFFFFF20">
                  {item.contactType === 'Discord' && <DiscordIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                  {item.contactType === 'Twitter' && <TwitterOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                  {item.contactType === 'Wechat' && <WechatOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                  {item.contactType === 'Email' && <EmailIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                  <span className='ml-2 text-14px'>@{item.name}</span>
                </div>
              )
            })}
          </div>
          <div className='absolute bottom-24px left-0 right-0 frc-center'>
            <img src={IconDeschool} alt="deschool" width={24} height={24} />
            <div className={`ml-2 text-white text-16px font-ArchivoNarrow`}>DeSchool & Booth</div>
          </div>
        </div>
        <div className='frc-center mt-8'>
          <Button type='primary' loading={loading} onClick={handleOk} >GEN</Button>
        </div>
        <div className='w-327px min-w-327px h-734px border-1 bg-gray-100'>
          {resumeCardUrl && <img src={resumeCardUrl} alt="resume card" className='w-full h-full'/>}
        </div>
      </div>
    </Modal>
    </>
  )
}

export default BusinessCard
