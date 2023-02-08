/* eslint-disable camelcase */
// i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh_CN_Common from './zh-CN/common'
import en_US_Common from './en-US/common'
import zh_CN_Userbar from './zh-CN/userbar'
import en_US_Userbar from './en-US/userbar'
import zh_CN_Profile from './zh-CN/profile'
import en_US_Profile from './en-US/profile'
import zh_CN_Message from './zh-CN/message'
import en_US_Message from './en-US/message'
import zh_CN_Explore from './zh-CN/explore'
import en_US_Explore from './en-US/explore'
import { getLanguage } from '../utils/language'
import zh_CN_Posk from './zh-CN/posk'
import en_US_Posk from './en-US/posk'

const resources = {
  zh_CN: {
    translation: {
      ...zh_CN_Common,
      ...zh_CN_Userbar,
      ...zh_CN_Profile,
      ...zh_CN_Message,
      ...zh_CN_Explore,
      ...zh_CN_Posk,
    },
  },
  en_US: {
    translation: {
      ...en_US_Common,
      ...en_US_Userbar,
      ...en_US_Profile,
      ...en_US_Message,
      ...en_US_Explore,
      ...en_US_Posk,
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
