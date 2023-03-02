import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import dayjs from 'dayjs'
import { interestEvent } from '~/api/booth/event'
import { getUserContext, useAccount } from '~/context/account'
import AvatarList from './AvatarList'
import Tags from './Tags'

type RecommandEventCardProps = {
  info: RecomendedEvents
}

const RecommandEventCard: React.FC<RecommandEventCardProps> = (props) => {
  const { info } = props
  const count = 10
  const avatarList = ['', '', '']
  const account = getUserContext()

  const handleIterested = async () => {
    // TODO record user interested event
    await interestEvent({
      targetId: info.id,
      address: account.address,
    })
    window.open(`https://link3.to/e/${info.id}`)
  }

  return (
    <div className="flex-1 rounded-2 max-w-420px bg-white shadow">
      <img src={info?.posterUrl} alt="poster" className="rounded-tl-2 rounded-tr-2 aspect-[16:9]"/>
      <div className='px-4 pb-6 pt-4'>
        <div className="text-2xl mb-2">{info?.title}</div>
        <div className="mb-1">{dayjs(`${info.startTimestamp}000`).format('ddd, MMMM, MM, YYYY')}</div>
        <div className="mb-2">{dayjs(`${info.startTimestamp}000`).format('hh:mm A')} - {dayjs(`${info?.endTimestamp}1000`).format('hh:mm A')}</div>
        <Tags tags={info.tags} />
        <div className="frc-between gap-4 mt-4">
          <Button onClick={() => handleIterested()}>I’m interested</Button>
          <div className="flex-1 frc-start ">
            <AvatarList avatarList={avatarList} />
            <span className="flex-1 whitespace-nowrap">xxx +{count} on Booth is also going</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommandEventCard
