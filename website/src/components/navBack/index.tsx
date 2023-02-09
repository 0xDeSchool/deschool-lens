import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

// 返回某个路径，统一处理
const NavBack: React.FC<{ backpath: string; replace?: boolean }> = (props: { backpath: string; replace?: boolean }) => {
  const { backpath, replace } = props
  const { t } = useTranslation()

  return (
    <NavLink to={backpath} replace={replace}>
      <div className="flex items-center py-2 px-4 text-white bg-#6525FF hover:text-purple-100">
        <ArrowLeftOutlined style={{ fontSize: '28px' }} className="cursor-pointer" />
        <span className="text-3xl ml-4 cursor-pointer">{t('back')}</span>
      </div>
    </NavLink>
  )
}

export default NavBack
