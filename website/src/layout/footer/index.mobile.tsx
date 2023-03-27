import { useEffect, useState } from 'react'
import { TwitterOutlined } from '@ant-design/icons'
import { MirrorIcon, TelegramIcon } from '~/components/icon'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import Tooltip from 'antd/es/tooltip'
import Logo from '../logo'

const Footer = () => {
  const { t } = useTranslation()
  const [hidden, setHidden] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/404' || location.pathname === '/noauth') {
      setHidden(true)
    } else {
      setHidden(false)
    }
  }, [location])

  /* eslint-enable no-template-curly-in-string */
  return (
    <div className="w-full bg-#FAFAFA frc-center pb-8 md:pb-0 board-landing">
      <div className="px-12px">
        {!hidden ? (
          <div>
            <div className="mt-10 w-full m-auto font-normal flex flex-col md:flex-row items-start justify-between">
              <div className="flex flex-1 flex-col justify-between w-full md:w-267px mb-16 md:mb-0">
                <Logo />
                <p className="mt-8 text-#181818A6 text-16px">
                  <span className="mr-1">{t('foot.join')}</span>
                  <a className="text-purple-6" href="https://t.me/deschoolcommunity" target="_blank" rel="noreferrer">
                    @{t('foot.deschoolCommunity')}
                  </a>
                </p>
              </div>
              <div className="flex-2 flex flex-col items-start justify-start text-#181818D9 mb-16 md:mb-0">
                <h1 className="text-40px font-Anton mb-6">Support</h1>
                <div className="w-full frc-end font-ArchivoNarrow text-#181818D9 text-20px">
                  <div className="w-max cursor-pointer">
                    <Tooltip placement="top" title={t('comingSoon')}>
                      {t('faq')}
                    </Tooltip>
                  </div>
                  <div className="w-max mx-8 cursor-pointer">
                    <Tooltip placement="top" title={t('comingSoon')}>
                      {t('whitepaper')}
                    </Tooltip>
                  </div>
                  <div className="w-max">
                    <a href="mailto:info@deschool.app" className="uppercase text-#181818D9">
                      {t('foot.contactus')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex bg-#1818180f w-full m-auto h-2px lg:my-2"> </div>
          </div>
        ) : null}
        <div className="w-full m-auto h-20 flex items-start md:items-center justify-between flex-col-reverse md:flex-row font-ArchivoNarrow">
          <div className="flex flex-row items-center text-#181818D9">
            <span className="text-20px mr-2">Copyright</span>
            <span className="text-20px mr-2">©</span>
            <span className="text-20px"> 2023 BOOTH</span>
          </div>
          <div className="md:hidden bg-#1818180f w-full min-h-2px h-2px m-auto my-4 lg:my-2"> </div>
          <div className="flex flex-row gap-4 max-w-xs md:mr-14">
            <div
              className="!flex cursor-pointer justify-center items-center border rounded-full bg-#1818180f w-10 h-10"
              onClick={() => {
                window.open('https://twitter.com/DeSchool2022')
              }}
            >
              <TwitterOutlined
                style={{ fontSize: '20px', background: 'none' }}
                className="!flex cursor-pointer justify-center items-center border rounded-full bg-#1818180f w-10 h-10"
              />
            </div>
            <div
              className="!flex cursor-pointer justify-center items-center border rounded-full bg-#1818180f w-10 h-10"
              onClick={() => {
                window.open('https://t.me/deschoolcommunity')
              }}
            >
              <TelegramIcon width="20px" height="20px" />
            </div>
            <div
              className="!flex cursor-pointer justify-center items-center border rounded-full bg-#1818180f w-10 h-10"
              onClick={() => {
                window.open('https://mirror.xyz/0xC83AbbE7ED8479381367cC9600654259f8D392EE')
              }}
            >
              <MirrorIcon width="15px" height="8px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
