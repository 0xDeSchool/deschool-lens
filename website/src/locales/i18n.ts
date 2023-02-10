/* eslint-disable camelcase */
// i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ZH_CN_COMMON from './zh-CN/common'
import EN_US_COMMON from './en-US/common'
import ZH_CN_USERBAR from './zh-CN/userbar'
import EN_US_USERBAR from './en-US/userbar'
import ZH_CN_PROFILE from './zh-CN/profile'
import EN_US_PROFILE from './en-US/profile'
import ZH_CN_MESSAGE from './zh-CN/message'
import EN_US_MESSAGE from './en-US/message'
import ZH_CN_EXPLORE from './zh-CN/explore'
import EN_US_EXPLORE from './en-US/explore'
import ZH_CN_POSK from './zh-CN/posk'
import EN_US_POSK from './en-US/posk'
import ZH_CN_LANDING from './zh-CN/landing'
import EN_US_LANDING from './en-US/landing'
import { getLanguage } from '../utils/language'

const resources = {
  zh_CN: {
    translation: {
      ...ZH_CN_COMMON,
      ...ZH_CN_USERBAR,
      ...ZH_CN_PROFILE,
      ...ZH_CN_MESSAGE,
      ...ZH_CN_EXPLORE,
      ...ZH_CN_POSK,
      ...ZH_CN_LANDING,
    },
  },
  en_US: {
    translation: {
      ...EN_US_COMMON,
      ...EN_US_USERBAR,
      ...EN_US_PROFILE,
      ...EN_US_MESSAGE,
      ...EN_US_EXPLORE,
      ...EN_US_POSK,
      ...EN_US_LANDING,
    },
  },
}
const lng = getLanguage()
i18n.use(initReactI18next).init({
  returnNull: false,
  resources,
  fallbackLng: 'en_US',
  lng,
  // keySeparator: true, // we do not use keys in form messages.welcome
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})

export default i18n
