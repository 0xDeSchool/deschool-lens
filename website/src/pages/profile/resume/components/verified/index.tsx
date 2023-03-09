import { useEffect, useState } from 'react'
import message from 'antd/es/message'
import type { Identity } from '~/api/booth/booth'
import { PlatformType, getVerifiedIdentities } from '~/api/booth/booth'

import { getUserContext } from '~/context/account'
import Tooltip from 'antd/es/tooltip'
import { InfoCircleOutlined } from '@ant-design/icons'
import { getShortAddress } from '~/utils/format'

type VerifiedProp = {
  handle?: string
}

const Verified = (props: VerifiedProp) => {
  const { handle } = props
  const address = getUserContext().lensToken?.address || getUserContext().deschoolProfile?.address
  const [identities, setIdentities] = useState<Identity[]>()

  const initIdentities = async () => {
    try {
      if (address) {
        let res = await getVerifiedIdentities(address)
        if (res) {
          res = res.filter(iden => iden.platform > 0)
          setIdentities(res)
        }
        // TODO: 根据handles批量获取对应平台的profiles信息
      } else {
        message.error('VerifiedIds error: address missing, please disconnect and re-login')
      }
    } catch (error) {
      message.error(`VerifiedIds error: check console log`)
      console.log('VerifiedIds error:', error)
    }
  }

  useEffect(() => {
    initIdentities()
  }, [handle])

  return identities && identities.length > 0 ? (
    <div className="w-full border shadow-md rounded-xl my-4 p-4">
      <div className="frc-start mx-2 my-2">
        <h1 className="text-2xl font-bold">Verified ID List</h1>
        <Tooltip
          className="ml-2"
          title={
            "SBT scattered across your multiple addresses? It doesn't matter, Booth allows you to link multiple identities, and the address identities you have associated are all below"
          }
        >
          <InfoCircleOutlined />
        </Tooltip>
      </div>
      <div className="mx-2 my-2">
        {identities?.map((identity, index) => (
          <div key={`${index}-${identity?.address}`} className="relative p-4 w-full frs-center mt-2 bg-gray-1 rounded-xl">
            <div className="flex-1 fcs-center font-ArchivoNarrow">
              <h1 className="text-large font-bold">{identity?.lensHandle ? identity?.lensHandle : getShortAddress(identity?.address)}</h1>
              <h3 className=" mt-1">Provider: {['Booth', 'Deschool', 'Lens'][identity?.platform]}</h3>
              <div className="mt-4 text-sm color-gray">
                <p className="mb-0">
                  {identity.platform === PlatformType.BOOTH
                    ? 'Your account is linked with an address on Booth platform. You can add SBTs gained from this verified address. This address can only be binded with your address.'
                    : 'Your account is linked with an address on DeSchool platform. You can add SBTs gained from this verified address. This address can only be binded with your address.'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>{null}</div>
  )
}
export default Verified
