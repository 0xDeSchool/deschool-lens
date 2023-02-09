import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getUserSBTs } from '~/api/account'
import Skeleton from 'antd/es/skeleton'
import Empty from 'antd/es/empty'
import Image from 'antd/es/image'
import message from 'antd/es/message'
import { Link } from 'react-router-dom'
import fallbackImage from '~/assets/images/fallbackImage'
import Tooltip from 'antd/es/tooltip'
import type { CourseCoursePolicyDetail } from '~/lib/types/app'

const RecentSBT = (props: { address: string | undefined }) => {
  const { address } = props
  const [loading, setIsLoading] = useState(true)
  const [sbts, setSBTs] = useState([] as CourseCoursePolicyDetail[])
  const { t } = useTranslation()

  const getPasses = async () => {
    if (!address) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const res: any = await getUserSBTs(address)
      if (res && res.message) {
        message.error(res.message)
      } else if (res && res.length !== 0) {
        setSBTs(res)
      } else {
        throw new Error('返回信息为空')
      }
    } catch (error) {
      console.log(error) // eslint-disable-line no-console
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getPasses()
  }, [address])

  return (
    <div className="block">
      {loading ? (
        <Skeleton />
      ) : (
        <div className="flex flex-row flex-wrap">
          {sbts &&
            sbts.length > 0 &&
            sbts.map(sbt => (
              <div key={sbt.id} className="fcc-center p-4 shadow rounded w-400px m-2 xl:w-357px bg-white">
                <div className="w-full h-200px border text-center bg-#f6f6f6">
                  <Image
                    fallback={fallbackImage}
                    src={sbt.url}
                    alt={sbt.description}
                    width="200px"
                    height="200px"
                    className="object-cover object-top object-center"
                    preview
                  />
                </div>
                <div className="px-4 mt-6 h-max flex flex-col justify-start">
                  {sbt.name && sbt.name.length > 28 ? (
                    <Tooltip title={sbt.name} color="#774FF8">
                      <Link to={`/sbtIntro/${sbt.id}`} className="h-64px color-#774FF8 text-20px mb-2 text-left two-line-wrap">
                        {sbt.name}
                      </Link>
                    </Tooltip>
                  ) : (
                    <Link to={`/sbtIntro/${sbt.id}`} className="h-64px color-#774FF8 text-20px mb-2 text-left two-line-wrap">
                      {sbt.name}
                    </Link>
                  )}
                  {sbt.description && sbt.description.length > 59 ? (
                    <Tooltip title={sbt.description}>
                      <div className="mt-2 three-line-wrap h-70px">{sbt.description}</div>
                    </Tooltip>
                  ) : (
                    <div className="mt-2 three-line-wrap h-70px">{sbt.description}</div>
                  )}
                </div>
              </div>
            ))}
          {(!sbts || sbts.length === 0) && <Empty style={{ width: '100%' }} description={<span>{t('explore.noresult')}</span>} />}
        </div>
      )}
    </div>
  )
}
export default RecentSBT
