import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { NotFoundIcon } from '~/components/icon'

const NoAuth = () => {
  const { t } = useTranslation()

  return (
    <div className="relative w-full h-full flex flex-col scroll-hidden items-center justify-center bg-transparent">
      <div className="flex flex-col items-center justify-center mb-10">
        <NotFoundIcon />
        <div className="flex items-center font-ArchivoNarrow text-2xl font-bold">{t('noAccess')}</div>
      </div>
      <NavLink to="/landing" replace>
        <button
          type="button"
          className="flex items-center text-white bg-#6525FF hover:cursor-pointer hover:bg-purple-500"
          onClick={() => {}}
        >
          {t('backhome')}
        </button>
      </NavLink>
    </div>
  )
}
export default NoAuth
