import { useEffect, useState } from 'react'
import message from 'antd/es/message'
import type { Identity } from '~/api/booth/booth'
import { PlatformType, getVerifiedIdentities } from '~/api/booth/booth'

import { getAddress } from '~/auth'
import Skeleton from 'antd/es/skeleton'
import Empty from 'antd/es/empty'
import { DEFAULT_AVATAR } from '~/context/account'
import Avatar from 'antd/es/avatar'
import Tooltip from 'antd/es/tooltip'
import { InfoCircleOutlined } from '@ant-design/icons'

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
      <div className="frc-start mb-6">
        <h1 className="text-2xl font-bold">Verified ID List</h1>
        <Tooltip
          className="ml-2"
          title={
            "SBT scattered across your multiple addresses? It doesn't matter, Booth allows you to link multiple identities, and the address identities you have associated are all below"
          }
        >
          <InfoCircleOutlined />{' '}
        </Tooltip>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading ? (
        <Skeleton />
      ) : identities && identities.length > 0 ? (
        identities?.map(identity => (
          <div key={identity?.address} className="relative border rounded-xl p-4 w-full frs-center mt-2">
            <div className="relative w-60px h-60px">
              <Avatar src={DEFAULT_AVATAR} size={60} className="fcc-center w-full" />
            </div>
            <div className="flex-1 fcs-center ml-4 font-ArchivoNarrow">
              <h1 className="text-large font-bold">{identity?.address}</h1>
              <h3 className=" mt-1">Provider: {identity?.platform ? 'DeSchool' : 'Booth'}</h3>
              <div className="mt-4">
                <p>
                  {identity.platform === PlatformType.BOOTH
                    ? 'Your account is linked with an address on Booth platform. You can add SBTs gained from this verified address. This address can only be binded with your address.'
                    : 'Your account is linked with an address on DeSchool platform. You can add SBTs gained from this verified address. This address can only be binded with your address.'}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Empty />
      )}
    </div>
  )
}
export default Verified
