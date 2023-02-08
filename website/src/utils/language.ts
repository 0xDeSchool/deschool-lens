import { Session } from '.'

// 获取当前的language,默认中文
const getLanguage = () => {
  const session = new Session()
  const language = session.getSession('language', true)
  if (language) {
    return language
  }

  session.setSession('language', 'en_US', true)
  return 'en_US'
}

// 语言切换
const changeLanguage = (language: string) => {
  const session = new Session()
  session.setSession('language', language, true)
  // window.location.reload();
}

export { getLanguage, changeLanguage }
