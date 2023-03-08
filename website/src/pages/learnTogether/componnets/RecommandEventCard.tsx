import Button from 'antd/es/button'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useAccount } from '~/account'
import { interestEvent } from '~/api/booth/event'
import { MatchedEvent } from '~/hooks/useCCProfile'
import AvatarList from './AvatarList'
import Tags from './Tags'

type RecommandEventCardProps = {
  info: MatchedEvent
}

const RecommandEventCard: React.FC<RecommandEventCardProps> = (props) => {
  const { info } = props
  const account = useAccount()
  const [hasInterested, setHasInterested] = useState<boolean>(info.hasInterested)

  const handleIterested = async () => {
    if (account) {
      const res = await interestEvent({
        targetId: info.id,
        userId: account.id,
      })
      if (res) {
        setHasInterested(true)
      }

    }
    window.open(`https://link3.to/e/${info.id}`)
  }

  return (
    <div className="flex-1 rounded-2 max-w-620px bg-white shadow">
      <img src={info?.posterUrl} alt="poster" className="rounded-tl-2 rounded-tr-2 aspect-[16:9]" />
      <div className='px-4 pb-6 pt-4'>
        <div className="text-2xl mb-2">{info?.title}</div>
        <div className="mb-1">{dayjs(`${info.startTimestamp}000`).format('ddd, MMMM, MM, YYYY')}</div>
        <div className="mb-2">{dayjs(`${info.startTimestamp}000`).format('hh:mm A')} - {dayjs(`${info?.endTimestamp}1000`).format('hh:mm A')}</div>
        <Tags tags={info.tags} />
        <div className="frc-between gap-4 mt-4 ">
          <Button className='w-120px' type={hasInterested ? 'primary' : 'default'} onClick={() => handleIterested()}>
            {hasInterested ? 'interested' : "I'm interested"}
          </Button>
          {info.registrants && <div className="flex-1 frc-start ">
            <AvatarList avatarList={info.registrants.users} />
            <span className={`flex-1 whitespace-nowrap`}> {info.registrants.count <= 3 ? '' : ('+' + (info.registrants.count - 3))} on Booth is also going</span>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default RecommandEventCard
