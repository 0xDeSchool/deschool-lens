import { useTranslation } from 'react-i18next'
import { ArrowDownIcon } from '~/components/icon'
import { changeLanguage, getLanguage } from '~/utils/language'

const SwitchLanguage = () => {
  const { i18n } = useTranslation()

  const handleChange = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    if (i18n.language === 'en_US') {
      changeLanguage('zh_CN')
      i18n.changeLanguage('zh_CN')
    } else {
      changeLanguage('en_US')
      i18n.changeLanguage('en_US')
    }
  }
  return (
    <div
      className="flex flex-row items-center cursor-pointer text-xl text-black hover:text-#4F21FF mr-6"
      onClick={e => {
        handleChange(e)
      }}
    >
      <span className="mr-2 font-ArchivoNarrow break-words whitespace-nowrap">{getLanguage() === 'zh_CN' ? '中文' : 'EN'}</span>
      <ArrowDownIcon style={{ width: '16px', height: '16px' }} />
    </div>
  )
}

export default SwitchLanguage
