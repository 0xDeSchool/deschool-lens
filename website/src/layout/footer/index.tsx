import { useEffect, useState } from 'react'
import { TwitterOutlined } from '@ant-design/icons'
import { MirrorIcon, TelegramIcon } from '~/components/icon'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import Tooltip from 'antd/es/tooltip'
import Logo from '../logo'

/*
 * @description: footer
 * @author: Bianca
 */
const Footer = (props: { footerLayout: string }) => {
  const { footerLayout } = props
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
    <div className="w-full bg-white frc-center">
      <div className={footerLayout} style={footerLayout ? {} : { width: '94%', margin: '0px 3%' }}>
        {!hidden ? (
          <div>
            <div className="mt-10 w-full m-auto font-normal flex flex-row items-start justify-between">
              <div className="flex flex-col justify-between">
                <Logo />
                <p className="mt-8 text-#181818A6 text-16px">
                  <span className="mr-1">{t('foot.join')}</span>
                  <a className="text-purple-6" href="https://t.me/deschoolcommunity" target="_blank" rel="noreferrer">
                    @{t('foot.deschoolCommunity')}
                  </a>
                </p>
              </div>
              <div className="flex-1 flex flex-col items-end justify-start text-black">
                <h1 className="text-40px font-Anton mb-6">Support</h1>
                <div className="w-full frc-end font-ArchivoNarrow text-20px">
                  <div className="w-max uppercase" title="oo">
                    <Tooltip placement="top" title={t('comingSoon')}>
                      <span>{t('faq')}</span>
                    </Tooltip>
                  </div>
                  <div className="w-max mx-8">
                    <Tooltip placement="top" title={t('comingSoon')}>
                      {t('whitepaper')}
                    </Tooltip>
                  </div>
                  <div className="w-max">
                    <a href="mailto:info@deschool.app" className="uppercase text-black">
                      {t('foot.contactus')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-#1818180f w-full m-auto h-2px lg:my-2"> </div>
          </div>
        ) : null}
        <div className="w-full m-auto h-20 frc-between font-ArchivoNarrow">
          <div className="flex flex-row items-center text-black">
            <span className="text-20px mr-2">Copyright</span>
            <span className="text-20px mr-2">©</span>
            <span className="text-20px"> 2023 BOOTH</span>
          </div>
          <div className="flex flex-row gap-4 max-w-xs">
            <TwitterOutlined
              style={{ fontSize: '20px' }}
              className="!flex cursor-pointer justify-center items-center border rounded-full bg-#1818180f w-10 h-10"
              onClick={() => {
                window.open('https://twitter.com/DeSchool2022')
              }}
            />
            <div className="!flex cursor-pointer justify-center items-center border rounded-full bg-#1818180f w-10 h-10">
              <TelegramIcon
                width="20px"
                height="20px"
                onClick={() => {
                  window.open('https://t.me/deschoolcommunity')
                }}
              />
            </div>
            <div className="!flex cursor-pointer justify-center items-center border rounded-full bg-#1818180f w-10 h-10">
              <MirrorIcon
                width="15px"
                height="8px"
                onClick={() => {
                  window.open('https://mirror.xyz/0xC83AbbE7ED8479381367cC9600654259f8D392EE')
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
