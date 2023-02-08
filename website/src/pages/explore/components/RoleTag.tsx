import { useTranslation } from 'react-i18next'

const RoleTag = (props: { status: number }) => {
  const { status } = props
  const { t } = useTranslation()
  const colorDic = ['bg-#02C07633 text-#02C076', 'bg-#f2652233 text-#f26522', 'bg-#00aeef33 text-#00aeef']

  return <div className={`frc-center rounded-md p-1 font-ArchivoNarrow ${colorDic[status]}`}>• {t(`exploreRoleDic.role${status}`)}</div>
}

export default RoleTag
