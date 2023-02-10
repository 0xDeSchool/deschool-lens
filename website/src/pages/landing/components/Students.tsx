import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import UsersAvatars from './UsersAvatars'

const Students = (props: { users: Creator[]; count: number; textColor?: string; sameColor?: boolean }) => {
  const { users, count, textColor, sameColor } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  return count && count > 0 ? (
    <div className="frc-start py-3">
      <UsersAvatars users={users} />
      <div className="-ml-6px -ml-14px -ml-24 hidden" />
      <span
        className={`text-14px font-ArchivoNarrow ${textColor || 'text-white'} ${
          users.length === 1 ? 'ml-4px' : `-ml-${(users.length - 1) * 10 - 6}px z-2`
        }`}
      >
        <a
          className={`cursor-pointer ${sameColor === true ? textColor : ''}`}
          onClick={() => {
            navigate(`/profile/${users[0].id}`)
          }}
        >{`${users[0].username.slice(0, 6)}${users[0].username.length > 6 ? '...' : ' '}`}</a>
        {count > 3 ? `+ ${count - 3} ${t('hotSeries.moreStudent')}` : t('hotSeries.moreStudent')}
      </span>
    </div>
  ) : (
    <div className="py-3 text-14px leading-26px font-ArchivoNarrow">{t('hotSeries.emptyStudent')}</div>
  )
}

export default Students
