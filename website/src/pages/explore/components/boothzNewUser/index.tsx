

import Skeleton from 'antd/es/skeleton'
import { useState } from 'react'
import UserCardItem from './UserCardItem'

type BoothNewUserProps = {
  [key: string]: any
}

const BoothNewUserSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-3 m-auto">
      <div className="fcs-center inline-flex bg-white rounded-md shadow-md m-2 col-span-1">
        <div>
          <Skeleton.Avatar active style={{ width: '28px', height: '28px' }} className="mb-4 mx-auto" />
          <Skeleton.Avatar active style={{ width: '28px', height: '28px' }} className="mb-4 mx-auto" />
          <Skeleton.Avatar active style={{ width: '100%', height: '28px' }} className="mb-4 mx-auto" />
        </div>
      </div>
    </div>
  )
}

const BoothNewUser: React.FC<BoothNewUserProps> = (props) => {
  const { } = props
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <BoothNewUserSkeleton />
  }
  return (
    <div>
      {/* header */}
      <UserCardItem />
    </div>
  )
}

export default BoothNewUser
