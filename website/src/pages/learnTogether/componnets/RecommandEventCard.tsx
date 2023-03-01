import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import dayjs from 'dayjs'

type RecommandEventCardProps = {
  info: RecomendedEvents
}

const RecommandEventCard: React.FC<RecommandEventCardProps> = (props) => {
  const { info } = props

  const handleIterested = () => {
    // TODO record user interested event
    window.open(`https://link3.to/e/${info.id}`)
  }

  return (
    <div className="flex-1 rounded-2 max-w-420px bg-white shadow">
      <img src={info?.posterUrl} alt="poster" className="rounded-tl-2 rounded-tr-2"/>
      <div className='px-4 pb-6 pt-4'>
        <div className="text-2xl mb-2">{info?.title}</div>
        <div className="mb-1">{dayjs(`${info.startTimestamp}000`).format('ddd, MMMM, MM, YYYY')}</div>
        <div className="mb-2">{dayjs(`${info.startTimestamp}000`).format('hh:mm A')} - {dayjs(`${info?.endTimestamp}1000`).format('hh:mm A')}</div>
        <div className='frc-start gap-4 mb-4'>
          {info.tags?.map((tag: string) => {
            return (
              <div className="frc-center gap-1">
                <span>🏷️</span><span className="font-500">{tag}</span>
              </div>
            )
          })}
        </div>
        <div className="frc-between gap-4">
          <Button onClick={() => handleIterested()}>I’m interested</Button>
          <div className="flex-1">
            <Avatar />
            xxx + on Booth is also going
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommandEventCard
