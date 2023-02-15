import { useEffect, useState } from 'react'
import message from 'antd/es/message'
import type { Identity} from '~/api/booth/booth';
import { PlatformType , getVerifiedIdentities } from '~/api/booth/booth'

import { getAddress } from '~/auth'
import Skeleton from 'antd/es/skeleton'
import Empty from 'antd/es/empty'
import { DEFAULT_AVATAR } from '~/context/account'
import Avatar from 'antd/es/avatar'

type VerifiedProp = {
  handle?: string
}

const Verified = (props: VerifiedProp) => {
  const { handle } = props
  const address = getAddress()
  const [identities, setIdentities] = useState<Identity[]>()
  const [loading, setLoading] = useState<boolean>(true)

  const initIdentities = async () => {
    setLoading(true)
    try {
      if (address) {
        const res = await getVerifiedIdentities(address)
        // TODO: 根据handles批量获取对应平台的profiles信息
        setIdentities(res)
      } else {
        message.error('VerifiedIds error: address missing, please disconnect and re-login')
      }
    } catch (error) {
      message.error(`VerifiedIds error: check console log`)
      console.log('VerifiedIds error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initIdentities()
  }, [handle])

  return (
    <div>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="shadow-module fcc-start max-h-600px p-4 space-y-2 overflow-auto scroll-hidden">
          {identities && identities.length > 0 ? (
            identities?.map(identity => (
              <div key={identity?.address} className="relative border rounded-xl p-2 w-full frs-center">
                <div className="relative w-60px h-60px">
                  <Avatar src={DEFAULT_AVATAR} size={60} className="fcc-center w-full" />
                </div>
                <div className="flex-1 fcs-center ml-2 font-ArchivoNarrow">
                  <h1>{identity?.address}</h1>
                  <h3>Provider: {identity?.platform}</h3>
                  <p>
                    {identity.platform === PlatformType.BOOTH
                      ? 'This is a successfully linked with DeSchool Account. You can add SBTs gained from this verified address. This address can only be binded with your address.'
                      : 'This is a successfully linked with DeSchool Account. You can add SBTs gained from this verified address. This address can only be binded with your address.'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>
      )}
    </div>
  )
}
export default Verified
