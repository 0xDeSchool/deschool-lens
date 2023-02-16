import Empty from 'antd/es/empty'
import List from 'antd/es/list'
import Skeleton from 'antd/es/skeleton'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getDefaultProfileRequest } from '~/api/lens/profile/get-default-profile'
import Jazzicon from 'react-jazzicon'

const OwnersOnLens = (props: { owners: string[] }) => {
  const { owners } = props
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [ownersOfLens, setOwnersOfLens] = useState<string[]>([] as string[])

  const initLensOwners = async () => {
    setLoading(true)
    try {
      const requests = owners.map(address => getDefaultProfileRequest({ ethereumAddress: address }))
      const results = await Promise.all(requests)
      const tempOwners = []
      // eslint-disable-next-line no-debugger
      debugger
      for (let index = 0; index < results.length; index++) {
        if (!results[index]) {
          tempOwners.push(owners[index])
        }
      }
      setOwnersOfLens(tempOwners)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initLensOwners()
  }, [owners])

  const handleVisitProfile = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, owner: string) => {
    e?.stopPropagation()
    if (!owner) {
      return
    }
    navigate(`/profile/${owner}`)
  }

  return (
    <>
      {loading && <Skeleton className="mt-4" />}
      {!loading && ownersOfLens && ownersOfLens.length > 0 ? (
        <List className="mt-4 rounded  bg-#1818180f">
          {ownersOfLens.map(owner => (
            <List.Item key={owner} className="!justify-start hover:bg-#1818180f">
              <div className="w-full flex flex-row justify-between items-center font-ArchivoNarrow">
                <div className="frc-start">
                  <div
                    onClick={(e: any) => {
                      handleVisitProfile(e, owner)
                    }}
                  >
                    <Jazzicon diameter={64} seed={Math.floor(Math.random() * 10000)} />
                  </div>
                  <div className="flex flex-col ml-6 flex-1 overflow-hidden">
                    <span
                      className="mr-4 text-xl font-bold line-wrap one-line-wrap cursor-pointer"
                      onClick={e => {
                        e?.preventDefault()
                        handleVisitProfile(e, owner)
                      }}
                    >
                      {owner}
                    </span>
                  </div>
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
