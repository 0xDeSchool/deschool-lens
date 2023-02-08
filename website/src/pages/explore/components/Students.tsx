// import { useTranslation } from 'react-i18next'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { getLanguage } from '~/utils/language'
import UsersAvatars from './UsersAvatars'
import type { Creator } from '~/lib/types/app'

const Students = (props: { users: Creator[]; count: number; textColor?: string }) => {
  const { users, count, textColor } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  return count && count > 0 ? (
    <div className="frc-start py-3">
      <UsersAvatars users={users} />
      <span className={`ml-10px text-14px font-ArchivoNarrow ${textColor || 'text-white'}`}>
        {getLanguage() === 'zh_CN' ? (
          ' '
        ) : (
          <a
            className="cursor-pointer"
            onClick={() => {
              navigate(`/profile/${users[0].id}`)
            }}
          >{`${users[0].username.slice(0, 6)}${users[0].username.length > 6 ? '...' : ''}`}</a>
        )}
        {count > 2 ? `+${count - 1} ${t('hotSeries.moreStudent')}` : t('hotSeries.moreStudent')}
      </span>
    </div>
  ) : (
    <div className="py-3 text-14px leading-26px font-ArchivoNarrow">{t('hotSeries.emptyStudent')}</div>
  )
}

export default Students
