import Button from 'antd/es/button'
import Modal from 'antd/es/modal/Modal'
import { message, QRCode } from 'antd';
import { useMemo, useState } from 'react'
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import { DiscordIcon, EmailIcon, TelegramIcon } from '~/components/icon';
import { TwitterOutlined, WechatOutlined } from '@ant-design/icons';
import IconDeschool from '~/assets/icons/deschool.svg'
import ShowMoreLoading from '~/components/loading/showMore';
import { getShortAddress } from '~/utils/format';
import { useProfileResume } from '~/context/profile';
import { download } from '~/utils';
import './gencard.css'
const DEFAULT_AVATAR = 'https://deschool.s3.amazonaws.com/booth/avatar/0xCdFB2b0Fb88265C80C36C1Fc42C1a2Cc3B28BAf5d04536a8-a062-4077-98ac-04f148a07292.png'

const BusinessCard = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [resumeCardUrl, setResumeCardUrl] = useState('')
  const { project, role, user } = useProfileResume()

  // email 不展示
  const contacts = useMemo(() => user?.contacts?.filter((item) => item.name && item.contactType !== 'Email') || [], [user])

  // const cacheImage = (src: string) => new Promise((resolve, reject) => {
  //   const img = new Image();
  //   if (src && !src.includes('deschool.s3.amazonaws.com')) {
  //     img.crossOrigin = "anonymous"
  //   }
  //   // img.crossOrigin = "anonymous"
  //   img.onload = (blob) => {
  //     console.log('图片加载成功blob', blob)
  //     resolve('');
  //   };
  //   img.onerror = (e) => {
  //     console.log(e);
  //     reject(new Error('图片加载失败'));
  //   };
  //   img.src = src;
  // })

  const handleOk = async () => {
    setOpen(true)
    setLoading(true)
    try {
      // await cacheImage(user?.avatar || '')
      // await cacheImage(project?.icon || '')
      html2canvas(document.querySelector('.business-card')!, {
        useCORS: true,
        backgroundColor: '#6525FF',
        width: 654,
        x: 0.5,
        y: -1.5,
      }).then((canvas) => {
        let tempBlob: any
        canvas.toBlob((blob) => {
          if (blob === null) return;
          const url = URL.createObjectURL(blob);
          tempBlob = blob
          setResumeCardUrl(url)
          // 释放URL对象
          // URL.revokeObjectURL(url);
        }, tempBlob?.type || 'image/png');
      });
    } catch (error) {
      message.error('preload image error')
      console.log('====', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    download(resumeCardUrl, `${user?.displayName}-business-card.png`)
    message.success(t('saveSuccess'))
  }

  return (
    <>
      <div className='w-full relative'>
        <Button size='large' type='primary' className='absolute bottom--48px left-0 right-0 h-40px' style={{ color: '#ffffff', width: '100%', height: '40px' }} onClick={handleOk}>Generate</Button>
      </div>
      <div className='absolute z--1'>
        <div className='business-card w-654px min-w-654px h-fit bg-gradient-to-b fcs-center from-#6525FF to-#9163FEdd text-white'>
          {user?.avatar ? <img
            crossOrigin={user?.avatar?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"}
            src={user?.avatar?.replace('https://deschool.s3.amazonaws.com/', `${location.origin}/awsResource/`)}
            alt={user?.displayName}
            className='w-600px h-600px aspect-[1/1] rounded-lg mx-auto mt-28px' />
            : <img
            crossOrigin="anonymous"
            src={DEFAULT_AVATAR?.replace('https://deschool.s3.amazonaws.com/', `${location.origin}/awsResource/`)}
            alt={user?.displayName}
            className='w-600px h-600px aspect-[1/1] rounded-lg mx-auto mt-28px' />}
          <div className='px-32px mt-64px mb-48px w-full frc-between'>
            {/* eslint-disable-next-line no-nested-ternary */}
            <span className='font-Anton text-48px break-all'>{user?.displayName === user?.address ? getShortAddress(user?.address) : (user?.displayName && user?.displayName.length > 15 ? getShortAddress(user?.displayName) : user?.displayName)}</span>
            <div className='inline-flex frc-start text-32px'>
              <img
                crossOrigin={project?.icon?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"}
                src={project?.icon?.replace('https://deschool.s3.amazonaws.com/', `${location.origin}/awsResource/`)}
                alt="project icon"
                className='w-48px h-48px min-w-48px min-h-48px rounded-full mr-8px mt-18px' />
              <span className='font-ArchivoNarrow '>{project?.name}</span>
            </div>
          </div>
          <div className='flex-1 frc-between w-full px-32px mb-64px'>
            <div className='text-32px font-ArchivoNarrow-Medium'>{role}</div>
          </div>
          <div className='w-full frc-center px-32px gap-32px'>
            <div className='w-full align-middle'>
              {contacts?.map((item) => (
                <div key={item.contactType} className="frc-start align-middle h-72px px-16px rounded-4px border-1 border-#FFFFFF20 mt-16px first:mt-0">
                  {item.contactType === 'Discord' && <DiscordIcon style={{ fontSize: 36, color: 'white', height: 36, width: 36 }} />}
                  {item.contactType === 'Twitter' && <TwitterOutlined style={{ fontSize: 36, color: 'white', height: 36, width: 36 }} />}
                  {item.contactType === 'Telegram' && <TelegramIcon style={{ fontSize: 36, color: 'white', height: 36, width: 36 }} />}
                  {item.contactType === 'Wechat' && <WechatOutlined style={{ fontSize: 36, color: 'white', height: 36, width: 36 }} />}
                  {item.contactType === 'Email' && <EmailIcon style={{ fontSize: 36, color: 'white', height: 36, width: 36 }} />}
                  <span className='text-20px ml-16px mt--12px break-words align-middle'>{`${item.name}`}</span>
                </div>
              ))}
            </div>
            <div className='min-w-240px w-240px min-h-240px h-240px self-center preload-resume-qrcode'>
              <QRCode
                errorLevel="M"
                size={240}
                color="#333333"
                bordered={false}
                value={`${location.origin}/resume/${user?.address}`}
                style={{ border: 'none', borderRadius: '8px', padding: 0, margin: 0, minWidth: '240px', minHeight: '240px' }}
              />
            </div>
          </div>
          <div className='w-full frc-center align-middle mb-32px mt-68px'>
            <img src={IconDeschool} alt="deschool" className='inline' width={24} height={24} />
            <span className="ml-8px text-white inline text-16px mt--10px font-ArchivoNarrow">DeSchool & Booth</span>
          </div>
        </div>
      </div>
      <Modal
        className='p-0 m-0'
        wrapClassName="p-0 m-0 share-card-modal bg-transparent"
        open={open}
        width='280px'
        title={null}
        footer={null}
        closable={false}
        centered
        closeIcon={null}
        bodyStyle={{ padding: 0 }}
        style={{ height: '610px', padding: 0, background: 'transparent' }}
        destroyOnClose
        onCancel={() => {
          setOpen(false)
        }}
        afterClose={() => {
          setOpen(false)
        }}
      >
        <div className='w-280px min-w-280px h-auto fcc-center p-0 m-0 rounded-lg'>
          {loading && <div><ShowMoreLoading /></div>}
          {(!loading && resumeCardUrl) && <img src={resumeCardUrl} alt="resume card" className='w-full h-full rounded-lg mb-16px object-contain' />}
          {(!loading && resumeCardUrl) && <Button type='primary' className='absolute bottom--10' style={{height: '40px', width: '280px'}} onClick={handleSave}>save</Button>}
        </div>
      </Modal>
    </>
  )
}

export default BusinessCard
