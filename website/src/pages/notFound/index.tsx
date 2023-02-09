import React from 'react'
import { NotFoundIcon } from '~/components/icon'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <div className="w-full h-full m-auto fcc-center bg-transparent">
      <div className="flex flex-col items-center justify-center mb-10">
        <NotFoundIcon />
        <div className="flex items-center font-ArchivoNarrow text-2xl font-bold">404</div>
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
export default NotFound
