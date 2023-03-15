import Button from 'antd/es/button'
import Modal from 'antd/es/modal/Modal'
import { message, QRCode } from 'antd';
import { useMemo, useState } from 'react'
import { useAccount } from '~/account'
import html2canvas from 'html2canvas';
import { download } from '~/utils';
import { useTranslation } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';
import { getShortAddress } from '~/utils/format';

const BusinessCard = () => {
  const [open, setOpen] = useState(false)
  const [qrcode, setQrcode] = useState<string>('https://dechooltest.s3.amazonaws.com/fe/download.png')
  const [loading, setLoading] = useState(false)
  const [qrcodeLoading, setQrcodeLoading] = useState(false)
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

  const preloadQRCode = () => {
    setQrcodeLoading(true)
    const canvas = document.querySelector('.preload-resume-qrcode')?.querySelector<HTMLCanvasElement>('canvas');
    console.log('canvas', canvas)
    if (canvas) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        // setQrcode(url)
        setQrcodeLoading(false)
      });
    }
  };

  const handleOk = () => {
    setLoading(true)
    cacheImage('https://dechooltest.s3.amazonaws.com/fe/0xb3153C43D0c8eA42D329918aF53fB8eE76BA07F37fb22b18-38d6-4378-8478-bf4ad0837bc6.jpeg').then(res => {
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
    // preloadQRCode()
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
        <div className='business-card fcc-between w-full min-w-420px h-240px p-4 rounded-2 bg-gray-200 drop-shadow-md shadow-md'>
          <div className='flex-1 w-full'>
            <div className='flex- frc-end h-14px text-14px leading-14px text-#666 mb-8px'>Supported by DeSchool & Booth</div>
            <div className='flex-1 frc-between w-full'>
              <div className='flex-1 frc-start'>
                <img crossOrigin="anonymous" src={'https://dechooltest.s3.amazonaws.com/fe/0xb3153C43D0c8eA42D329918aF53fB8eE76BA07F37fb22b18-38d6-4378-8478-bf4ad0837bc6.jpeg'} alt={user?.displayName} className="min-w-56px w-56px min-h-56px h-56px rounded-full"/>
                <div className='text-20px font-Anton ml-2 bg-clip-text text-shadow-#fff'
                >{user?.displayName === user?.address ? getShortAddress(user?.address) : user?.displayName}</div>
              </div>
              <div className='flex-1 fce-between'>
                <div className='text-18px font-ArchivoNarrow-Medium'>Most recent job title</div>
                <div className='font-ArchivoNarrow-Semibold'>org with logo</div>
              </div>
            </div>
          </div>
          <div className='flex-1 frc-between w-full'>
            <div className='font-ArchivoNarrow'>
              {contacts?.map((item, index) => {
                return (
                  <div key={item.contactType}>
                    <span className='text-gray text-12px text-right w-48px inline-block'>{item.contactType}</span>
                    <span className='ml-2 text-14px text-black'>{item.name}</span>
                  </div>
                )
              })}
            </div>
            <div className='w-86px h-86px self-end'>
              {/* <img crossOrigin="anonymous" src={qrcode} alt="qrcode" className='w-86px h-86px'/> */}
              <QRCode
                errorLevel="M"
                size={86}
                iconSize={20}
                color="#6525FF"
                bordered={false}
                value={`https://booth.ink/profile/${user?.address}/resume`}
                style={{ border: 'none', padding: 0, background: 'none' }}
                icon={user?.avatar}
              />
            </div>
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
