import Button from 'antd/es/button'
import Modal from 'antd/es/modal/Modal'
import { message, QRCode } from 'antd';
import { useMemo, useState } from 'react'
import { useAccount } from '~/account'
import html2canvas from 'html2canvas';
import { download } from '~/utils';
import { useTranslation } from 'react-i18next';
import { DiscordIcon, EmailIcon } from '~/components/icon';
import { TwitterOutlined, WechatOutlined } from '@ant-design/icons';
import IconDeschool from '~/assets/icons/deschool.svg'
import ShowMoreLoading from '~/components/loading/showMore';

const BusinessCard = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = useAccount()
  const { t } = useTranslation()
  const [resumeCardUrl, setResumeCardUrl] = useState('')

  const contacts = useMemo(() => {
    return user?.contacts?.filter((item) => item.name) || []
  }, [user])

  const cacheImage = async (src: string) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      if(src&&!src.includes('deschool.s3.amazonaws.com')){
        img.crossOrigin = "anonymous"
      }
      // img.crossOrigin = "anonymous"
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

  const handleOk = async () => {
    setOpen(true)
    setLoading(true)
    try {
      await cacheImage(user?.avatar || '')
      await cacheImage(user?.resumeInfo?.project?.icon || '')
      html2canvas(document.querySelector('.business-card')!, { useCORS: !user?.avatar?.includes('deschool.s3.amazonaws.com') }).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob === null) return;
          const url = URL.createObjectURL(blob);
          setResumeCardUrl(url)
          console.log('url', url)
          // download(url, `${user?.displayName}-business-card.png`)
          setLoading(false)
          // 释放URL对象
          // URL.revokeObjectURL(url);
          message.success(t('saveSuccess'))
        }, 'image/png');
      });
    } catch (error) {
      message.error('preload image error')
      console.log('====', error)
    }
  }

  return (
    <>
    <div>
      <Button type='text' style={{color: '#ffffff'}} onClick={handleOk}>Generate</Button>
    </div>
    <div className='absolute z--1'>
      <div className='business-card w-327px min-w-327px h-734px bg-gradient-to-b from-#6525FF to-#9163FE drop-shadow-md shadow-md text-white'>
        <img crossOrigin={user?.avatar?.includes('deschool.s3.amazonaws.com')?undefined:"anonymous"} src={user?.avatar} alt={user?.displayName} className="w-327px h-327px mb-16px"/>
        <div className='text-28px font-Anton px-12px mb-4'>
          {user?.displayName === user?.address ? user?.address : user?.displayName}
        </div>
        <div className='flex-1 frc-between w-full px-12px mb-34px'>
          <div className='flex-1'>
            <div className='text-18px font-ArchivoNarrow-Medium mb-2'>{user?.resumeInfo?.role}</div>
            <div className='frc-start'>
              <img crossOrigin={user?.resumeInfo?.project?.icon?.includes('deschool.s3.amazonaws.com')?undefined:"anonymous"} src={user?.resumeInfo?.project?.icon} alt="project icon" className='w-24px h-24px rounded-full mr-2 mt-9px'/>
              <div className='font-ArchivoNarrow-Semibold inline-flex h-24px leading-24px align-mid'>{user?.resumeInfo?.project?.name}</div>
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
              <div key={item.contactType} className="frc-center gap-1 h-43px w-full rounded-2 border-2 border-#FFFFFF20">
                {item.contactType === 'Discord' && <DiscordIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                {item.contactType === 'Twitter' && <TwitterOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                {item.contactType === 'Wechat' && <WechatOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                {item.contactType === 'Email' && <EmailIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                <span className='ml-2 text-14px mt--10px'>@{item.name}</span>
              </div>
            )
          })}
        </div>
        <div className='absolute bottom-24px left-0 right-0 frc-center'>
          <img src={IconDeschool} alt="deschool" width={24} height={24} />
          <div className={`ml-2 text-white text-16px font-ArchivoNarrow mt--12px`}>DeSchool & Booth</div>
        </div>
      </div>
    </div>
    <Modal
      className='padding-0'
      wrapClassName="padding-0"
      open={open}
      width='374px'
      title={null}
      footer={null}
      closable={false}
      centered
      closeIcon={null}
      bodyStyle={{ padding: 0 }}
      style={{ height: '734px', padding: 0 }}
      destroyOnClose
      onCancel={() => {
        setOpen(false)
      }}
      afterClose={() => {
        setOpen(false)
      }}
    >
      <div className='w-327px min-w-327px h-734px border-1 bg-gray-100 frc-center'>
        {(!loading && resumeCardUrl) && <img src={resumeCardUrl} alt="resume card" className='w-full h-full'/>}
        {loading && <div><ShowMoreLoading /></div>}
      </div>
    </Modal>
    </>
  )
}

export default BusinessCard
