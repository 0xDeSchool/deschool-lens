import Button from 'antd/es/button'
import Modal from 'antd/es/modal/Modal'
import { message, QRCode } from 'antd';
import { useMemo, useState } from 'react'
import { useAccount } from '~/account'
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import { DiscordIcon, EmailIcon } from '~/components/icon';
import { TwitterOutlined, WechatOutlined } from '@ant-design/icons';
import IconDeschool from '~/assets/icons/deschool.svg'
import ShowMoreLoading from '~/components/loading/showMore';
import { getShortAddress } from '~/utils/format';

const BusinessCard = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = useAccount()
  const { t } = useTranslation()
  const [resumeCardUrl, setResumeCardUrl] = useState('')

  const contacts = useMemo(() => user?.contacts?.filter((item) => item.name) || [], [user])

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
      // await cacheImage(user?.resumeInfo?.project?.icon || '')
      html2canvas(document.querySelector('.business-card')!, { useCORS: true }).then((canvas) => {
        let tempBlob: any
        canvas.toBlob((blob) => {
          if (blob === null) return;
          const url = URL.createObjectURL(blob);
          tempBlob = blob
          setResumeCardUrl(url)
          console.log('url', url)
          // download(url, `${user?.displayName}-business-card.png`)
          setLoading(false)
          // 释放URL对象
          // URL.revokeObjectURL(url);
          message.success(t('saveSuccess'))
        }, tempBlob?.type || 'image/png');
      });
    } catch (error) {
      message.error('preload image error')
      console.log('====', error)
    }
  }

  return (
    <>
      <div>
        <Button type='text' style={{ color: '#ffffff' }} onClick={handleOk}>Generate</Button>
      </div>
      <div className='absolute z--1'>
        <div className='business-card w-327px min-w-327px h-fit bg-gradient-to-b fcs-center from-#6525FF to-#9163FEdd text-white'>
          <img crossOrigin={user?.avatar?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"} src={user?.avatar} alt={user?.displayName} className="w-300px h-300px rounded-lg m-auto mt-14px" />
          <div className='px-16px my-4 w-full frc-between'>
            {/* eslint-disable-next-line no-nested-ternary */}
            <span className='font-Anton text-24px break-all'>{user?.displayName === user?.address ? getShortAddress(user?.address) : (user?.displayName && user?.displayName.length > 15 ? getShortAddress(user?.displayName) : user?.displayName)}</span>
            <div className='inline-flex frc-start text-16px'>
              <img crossOrigin={user?.resumeInfo?.project?.icon?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"} src={user?.resumeInfo?.project?.icon} alt="project icon" className='w-24px h-24px rounded-full mr-2' />
              <span className='font-ArchivoNarrow'>{user?.resumeInfo?.project?.name}</span>
            </div>
          </div>
          <div className='flex-1 frc-between w-full px-16px mb-2'>
            <div className='text-16px font-ArchivoNarrow-Medium mb-2'>{user?.resumeInfo?.role}</div>
          </div>
          <div className='frc-center'>
            <div className='w-full px-16px align-middle'>
              {contacts?.map((item) => (
                <div key={item.contactType} className="frc-start align-middle h-48px px-2 rounded-2 border-1 border-#FFFFFF30">
                  {item.contactType === 'Discord' && <DiscordIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                  {item.contactType === 'Twitter' && <TwitterOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                  {item.contactType === 'Wechat' && <WechatOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                  {item.contactType === 'Email' && <EmailIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />}
                  <span className='text-14px ml-1 mt--12px max-w-104px break-all align-middle'>{`${item.contactType === 'Twitter' ? "@" : ""}${item.name}`}</span>
                </div>
              ))}
            </div>
            <div className='w-120px h-120px self-center preload-resume-qrcode'>
              <QRCode
                errorLevel="M"
                size={120}
                color="#333333"
                bordered={false}
                value={`${location.origin}/profile/${user?.address}/resume/${user?.id}`}
                style={{ border: 'none', borderRadius: '4px', padding: 0, margin: 0 }}
              />
            </div>
          </div>
          <div className='w-full frc-center align-middle mb-4 mt-6'>
            <img src={IconDeschool} alt="deschool" className='inline' width={24} height={24} />
            <span className="ml-2 text-white inline text-16px mt--10px font-ArchivoNarrow">DeSchool & Booth</span>
          </div>
        </div>
      </div>
      <Modal
        className='p-0 m-0'
        wrapClassName="p-0 m-0 share-card-modal"
        open={open}
        width='327px'
        title={null}
        footer={null}
        closable={false}
        centered
        closeIcon={null}
        bodyStyle={{ padding: 0 }}
        style={{ height: '610px', padding: 0 }}
        destroyOnClose
        onCancel={() => {
          setOpen(false)
        }}
        afterClose={() => {
          setOpen(false)
        }}
      >
        <div className='w-327px min-w-327px h-610px frc-center p-0 m-0 rounded-lg'>
          {(!loading && resumeCardUrl) && <img src={resumeCardUrl} alt="resume card" className='w-full h-full rounded-lg' />}
          {loading && <div><ShowMoreLoading /></div>}
        </div>
      </Modal>
    </>
  )
}

export default BusinessCard
