import { useEffect, useState } from 'react'
// import message from 'antd/es/message'
import { TwitterOutlined } from '@ant-design/icons'
import { MirrorIcon, DeschoolIcon, TelegramIcon } from '~/components/icon'
import { useTranslation } from 'react-i18next'
// import postSubscribe from '~/api/subscription'
// import { useLayout } from '~/context/layout'
import { useLocation } from 'react-router'
import Tooltip from 'antd/es/tooltip'
// import { isLogin } from '~/auth'
// import fallbackImage from '~/assets/images/fallbackImage'

/*
 * @description: footer
 * @author: Bianca
 */
const Footer = (props: { footerLayout: string }) => {
  const { footerLayout } = props
  const { t } = useTranslation()
  // const { setConnectBoardVisible } = useLayout()
  // const [loading, setLoading] = useState<boolean>()
  const [hidden, setHidden] = useState(false)
  const location = useLocation()

  // const handleSubmit = async ({ email }: { email: string }) => {
  //   // TODO:由于后端请求需要userId，在此加入未登录状态先登录
  //   if (!isLogin()) {
  //     message.error('您目前处于未登录状态，请登陆后重新操作')
  //     setConnectBoardVisible(true)
  //     return
  //   }
  //   setLoading(true)
  //   if (!email) {
  //     message.error('邮箱地址不能为空')
  //     setLoading(false)
  //     return
  //   }
  //   try {
  //     const res: any = await postSubscribe({
  //       email,
  //     })
  //     if (res && res.success) {
  //       message.success('邮箱订阅成功')
  //     }
  //   } catch (error: any) {
  //     message.error(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // /* eslint-disable no-template-curly-in-string */

  // const validateMessages = {
  //   required: '${label} is required!',
  //   types: {
  //     email: '${label} is not a valid email!',
  //   },
  // }

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
              <div className="flex flex-col justify-between w-267px">
                <DeschoolIcon />
                <p className="mt-8">
                  <span className="mr-1">{t('foot.join')}</span>
                  <span className="mr-1">{t('foot.contactme')}</span>
                  <a className="text-purple-6" href="https://t.me/deschoolcommunity" target="_blank" rel="noreferrer">
                    Descool Community(TG)
                  </a>
                </p>
              </div>
              <div className="flex-1 flex flex-col items-end justify-start text-black">
                <h1 className="text-40px font-Anton mb-6">Support</h1>
                <div className="w-full frc-end font-ArchivoNarrow text-20px">
                  <div className="w-max" title="oo">
                    <Tooltip placement="top" title={t('comingSoon')}>
                      {t('faq')}
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
            <span className="text-20px"> 2023 DESCHOOL</span>
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
