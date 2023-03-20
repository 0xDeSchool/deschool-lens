import Button from 'antd/es/button'
import Modal from 'antd/es/modal/Modal'
import { message, QRCode } from 'antd';
import { useMemo, useState } from 'react'
import { useAccount } from '~/account'
import html2canvas from 'html2canvas';
import { download } from '~/utils';
import { useTranslation } from 'react-i18next';
import { DiscordIcon, TelegramIcon } from '~/components/icon';
import { TwitterOutlined } from '@ant-design/icons';

const BusinessCard = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = useAccount()
  const { t } = useTranslation()

  const contacts = useMemo(() => {
    return user?.contacts?.filter((item) => item.name) || []
  }, [user])

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
    cacheImage(user?.avatar).then(res => {
      html2canvas(document.querySelector('.business-card')!, { useCORS: true }).then((canvas) => {
        document.body.appendChild(canvas);
        canvas.toBlob((blob) => {
          if (blob === null) return;
          const url = URL.createObjectURL(blob);
          download(url, `${user?.displayName}-business-card.png`)
          setLoading(false)
          // 释放URL对象
          URL.revokeObjectURL(url);
          message.success(t('saveSuccess'))
        }, 'image/png');
      });
    })
  }

  const handleGenerate = () => {
    setOpen(true)
  }
  return (
    <>
    <div>
      <Button onClick={handleGenerate}>Generate</Button>
    </div>
    <Modal
      wrapClassName=""
      open={open}
      width='=800px'
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
      <>
        <div className='business-card w-327px min-w-327px h-734px bg-#6525FF drop-shadow-md shadow-md text-white'>
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
                value={`https://booth.ink/profile/${user?.address}/resume`}
                style={{ border: 'none', padding: 0, margin: 0, height: '80px', width: '80px' }}
              />
            </div>
          </div>
          <div className='w-full grid grid-cols-2 gap-2 font-ArchivoNarrow px-12px'>
            {contacts?.map((item) => {
              return (
                <div key={item.contactType} className="h-43px w-full rounded-2 border-1 frc-center">
                  {item.contactType === 'Discord' && <DiscordIcon style={{ fontSize: 14, color: 'white', width: 20, height: 20 }} />}
                  {item.contactType === 'Telegram' && <TelegramIcon style={{ fontSize: 14, color: 'white', width: 20, height: 20 }} />}
                  {item.contactType === 'Twitter' && <TwitterOutlined style={{ fontSize: 18, color: 'white' }} />}
                  <span className='ml-2 text-14px'>@{item.name}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className='frc-center mt-8'>
          <Button type='primary' loading={loading} onClick={handleOk} >保存名片</Button>
        </div>
      </>
    </Modal>
    </>
  )
}

export default BusinessCard
