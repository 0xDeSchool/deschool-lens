import Modal from 'antd/es/modal'
import Image from 'antd/es/image'
import nfcSticker from '~/assets/images/nfc-sticker.png'
import { useTranslation } from 'react-i18next'
import { CloseCircleFilled } from '@ant-design/icons'
import ConnectDeschool from '~/layout/userbar/popupConnectManage/connectDeschool'
import { useState } from 'react'

type RegisterCardProps = {
  registerCardVisible: boolean
  setRegisterCardVisible: (visible: boolean) => void
}

const RegisterCard = (props: RegisterCardProps) => {
  const { registerCardVisible, setRegisterCardVisible } = props
  const [unipassPanelVisible, setUnipassPanelVisible] = useState(false)
  const { t } = useTranslation()

  const handleClick = () => {
    setRegisterCardVisible(false)
    // 弹窗连接 unipass
    setUnipassPanelVisible(true)
  }

  return (
    <>
      <Modal
        className="p-0 m-0"
        wrapClassName="p-0 m-0 z-10 mt-60px registerCard"
        open={registerCardVisible}
        width="100%"
        title={null}
        footer={null}
        closable
        centered
        bodyStyle={{ height: '530px', padding: 0 }}
        maskStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
        closeIcon={<CloseCircleFilled style={{ color: 'white' }} />}
        style={{ height: '100%', padding: 0 }}
        destroyOnClose
        onCancel={() => {
          setRegisterCardVisible(false)
        }}
        afterClose={() => {
          setRegisterCardVisible(false)
        }}
      >
        <div className="w-286px h-full fcc-center p-0 m-0 mt-20px rounded-lg font-ArchivoNarrow text-16px leading-24px color-white">
          <p>{t('registerCard.p1')}</p>
          <p>{t('registerCard.p2')}</p>
          <Image preview={false} src={nfcSticker} alt="nfc sticker" width={205} height={193} />
          <desc className="mb-4 text-sm text-gray-300">NFC {t('registerCard.sticker')}</desc>
          <p className="text-18px font-bold">{t('registerCard.p3')}</p>
          <button type="button" className="bg-#8d65ff color-white w-172px h-44px text-18px px-55px py-8px mt-2" onClick={handleClick}>
            {t('registerCard.register')}
          </button>
        </div>
      </Modal>
      {unipassPanelVisible && (
        <div className="fixed w-full h-full fcc-center bg-#FFFFFF top-0 left-0 overflow-auto">
          <ConnectDeschool />
        </div>
      )}
    </>
  )
}

export default RegisterCard
