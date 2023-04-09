import { QRCode } from 'antd';
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { getShortAddress } from '~/utils/format';
import { useProfileResume } from '~/context/profile';
import ResumeContacts from '~/components/contacts';
import { DEFAULT_AVATAR } from '~/account';


const BusinessCard = () => {
  const { t } = useTranslation()
  const { user, followings, followers, project, role } = useProfileResume()

  const contacts = useMemo(() => user?.contacts?.filter((item) => !!item.url) || [], [user?.contacts])
  return (
    <div className='mx-auto mb-4 rounded-1 w-full min-w-327px bg-gradient-to-b from-#6525FF to-#9163FE text-white pb-16px'>
      <div className='relative w-full mb-16px'>
        {user?.avatar && <img crossOrigin={user?.avatar?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"} src={user?.avatar} alt={user?.displayName} className="w-full aspect-[1/1]" />}
        {!user?.avatar && <img src={DEFAULT_AVATAR} alt={user?.displayName} className="w-full aspect-[1/1]" />}
        <ResumeContacts contacts={contacts}/>
      </div>
      <div className='text-28px font-Anton px-12px mb-4'>
        {/* eslint-disable-next-line no-nested-ternary */}
        {user?.displayName === user?.address ? getShortAddress(user?.address) : (user?.displayName && user?.displayName.length > 15 ? getShortAddress(user?.displayName) : user?.displayName)}

      </div>
      <div className='flex-1 frc-between w-full px-12px mb-34px'>
        <div className='flex-1'>
          <div className='text-18px font-ArchivoNarrow-Medium mb-2'>{role}</div>
          <div className='frc-start'>
            {project?.icon && <img crossOrigin={project?.icon?.includes('deschool.s3.amazonaws.com') ? undefined : "anonymous"} src={project?.icon} alt="project icon" className='w-24px h-24px rounded-full mr-2' />}
            <div className='font-ArchivoNarrow-Semibold'>{project?.name}</div>
          </div>
        </div>
        <QRCode
          errorLevel="M"
          size={80}
          color="#333333"
          bordered={false}
          value={`${location.origin}/resume/${user?.address}`}
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
    </div>
  )
}

export default BusinessCard
