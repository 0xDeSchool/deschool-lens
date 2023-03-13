import Tooltip from 'antd/es/tooltip'
import { InfoCircleOutlined } from '@ant-design/icons'
import { getShortAddress } from '~/utils/format'
import { useAccount } from '~/account'

const Verified = () => {
  const user = useAccount()

  return user && user.platform.length > 0 ? (
    <div className="w-full border shadow-md rounded-xl my-4 p-4">
      <div className="frc-start mx-2 my-2">
        <h1 className="text-2xl font-bold">linked ID List</h1>
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
        {user?.platforms?.map((identity) => (
          <div key="{identity?.address}" className="relative p-4 w-full frs-center mt-2 bg-gray-1 rounded-xl">
            <div className="flex-1 fcs-center font-ArchivoNarrow">
              <h1 className="text-large font-bold">{getShortAddress(identity?.displayName || identity.handle)}</h1>
              <h3 className=" mt-1">Provider: {['Booth', 'Deschool', 'Lens', 'Cyber Connect'][identity?.platform]}</h3>
              <div className="mt-4 text-sm color-gray">
                <p className="mb-0">
                  {`Your account is linked with an address on ${['Booth', 'Deschool', 'Lens', 'Cyber Connect'][identity?.platform]}. You can add SBTs gained from this linked address. This address can only be binded with your address.·`}
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
