import CopyToClipboard from 'react-copy-to-clipboard'
import { Contact } from '~/api/booth/types'
import { DiscordIcon, EmailIcon, TelegramIcon } from '~/components/icon';
import { TwitterOutlined, WechatOutlined } from '@ant-design/icons';
import message from 'antd/es/message';
import { useDebounce } from '~/hooks/useDebounce';
import { useMemo } from 'react';

type ResumeContactsProps = {
  contacts: Contact[]
}
const ResumeContacts: React.FC<ResumeContactsProps> = (props) => {
  const { contacts } = props

  const onCopySuccess = () => {
    message.success('Copied')
  }

  // email 不展示
  const contactList = useMemo(() => {
    return contacts?.filter(item => item.contactType !== 'Email')
  }, [contacts])

  const debounce = useDebounce(onCopySuccess, 100, [])

  if (!(contactList?.length > 0)) {
    return <div></div>
  }

  return <div className='absolute left-0 bottom-0 right-0 z-1 w-full h-48px frc-center gap-4 bg-#18181826 backdrop-blur-sm'>
    {contactList?.map((item, index) => (
      <div key={item.contactType} className="frc-center gap-4 ">
        {item.contactType === 'Twitter' && <a href={item.url} target="_blank" className="frc-center gap-4"><TwitterOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} /></a>}
        {item.contactType === 'Telegram' && <a href={item.url} target="_blank" className="frc-center gap-4"><TelegramIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} /></a>}
        {/* {item.contactType === 'Discord' && <a href={item.url} target="_blank" className="frc-center gap-4"><DiscordIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} /></a>} */}
        {(item.contactType === 'Discord') && <CopyToClipboard
          text={item.name}
          onCopy={debounce}
        >
          <DiscordIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />
        </CopyToClipboard>}
        {item.contactType === 'Wechat' && <CopyToClipboard
          text={item.name}
          onCopy={debounce}
        >
          <WechatOutlined style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} />
        </CopyToClipboard>}
        {item.contactType === 'Email' && <a href={`mailto:${item.url}`} target="_blank" className="frc-center gap-4"><EmailIcon style={{ fontSize: 18, color: 'white', height: 18, width: 18 }} /></a>}
        {index < contactList.length - 1 && <div className='w-1px h-13px bg-#FFFFFF73' />}
      </div>
    ))}
  </div>
}

export default ResumeContacts
