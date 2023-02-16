import Avatar from 'antd/es/avatar'
import Empty from 'antd/es/empty'
import List from 'antd/es/list'
import Skeleton from 'antd/es/skeleton'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { getDefaultProfileRequest } from '~/api/lens/profile/get-default-profile'
import fallbackImage from '~/assets/images/fallbackImage'
import type { OwnerRecord } from '~/lib/types/app'

const OwnersOnLens = (props: { owners: OwnerRecord[] }) => {
  const { owners } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [ownersOfLens, setOwnersOfLens] = useState<OwnerRecord[]>([] as OwnerRecord[])

  const initLensOwners = async () => {
    setLoading(true)
    try {
      const addresses = owners.map(owner => owner.address)
      const requests = addresses.map(address => getDefaultProfileRequest({ ethereumAddress: address }))
      const results = await Promise.all(requests)
      let lensIndexs = results.map((val, index) => {
        if (val) {
          return index
        }
        return -1
      })
      lensIndexs = lensIndexs.filter(index => index > -1)
      if (lensIndexs.length > 0) {
        const tempOwners = []
        for (let index = 0; index < lensIndexs.length; index++) {
          tempOwners.push(owners[lensIndexs[index]])
        }
        setOwnersOfLens(tempOwners)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initLensOwners()
  }, [owners])

  const handleVisitProfile = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, owner: OwnerRecord) => {
    e?.stopPropagation()
    if (!owner.id) {
      return
    }
    navigate(`/profile/${owner.address}`)
  }

  return (
    <>
      {loading && <Skeleton className='mt-4'/>}
      {!loading && ownersOfLens && ownersOfLens.length > 0 ? (
        <List className="mt-4 rounded  bg-#1818180f">
          {ownersOfLens.map(owner => (
            <List.Item key={`${owner?.id}${owner?.avatar}`} className="!justify-start hover:bg-#1818180f">
              <div className="w-full flex flex-row justify-between items-center font-ArchivoNarrow">
                <div className="frc-start">
                  <Avatar
                    shape="circle"
                    src={owner?.avatar ? owner.avatar : fallbackImage}
                    className="mr-2 w-64px h-64px cursor-pointer"
                    size={64}
                    onClick={e => {
                      handleVisitProfile(e, owner)
                    }}
                  />
                  <div className="flex flex-col ml-6 flex-1 overflow-hidden">
                    <span
                      className="mr-4 text-xl font-bold line-wrap one-line-wrap cursor-pointer"
                      onClick={e => {
                        e?.preventDefault()
                        handleVisitProfile(e, owner)
                      }}
                    >
                      {owner?.username}
                    </span>
                    {/* <span className="mr-4 text-xl font-bold line-wrap one-line-wrap">{getShortAddress(owner.address)}</span> */}
                    <span>{owner?.bio}</span>
                  </div>
                </div>
                <div
                  className={`${owner?.sbtCount !== 0 ? 'cursor-pointer block' : 'hidden'}`}
                  onClick={e => handleVisitProfile(e, owner, true)}
                >
                  {t('own')}
                  <span className="mx-2">{owner?.sbtCount}</span>Posks
                </div>
              </div>
            </List.Item>
          ))}
        </List>
      ) : (
        !loading && <Empty />
      )}
    </>
  )
}

export default OwnersOnLens
