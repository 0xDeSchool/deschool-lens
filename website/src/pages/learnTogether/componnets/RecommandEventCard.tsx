import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import dayjs from 'dayjs'
import { useAccount } from '~/account'
import { interestEvent } from '~/api/booth/event'
import fallbackImage from '~/assets/images/fallbackImage'
import AvatarList from './AvatarList'
import Tags from './Tags'

type RecommandEventCardProps = {
  info: RecomendedEvents
}

const RecommandEventCard: React.FC<RecommandEventCardProps> = (props) => {
  const { info } = props
  const account = useAccount()

  const handleIterested = async () => {
    if (account) {
      await interestEvent({
        targetId: info.id,
        userId: account.id,
      })
    }
    window.open(`https://link3.to/e/${info.id}`)
  }

  return (
    <div className="flex-1 rounded-2 max-w-420px bg-white shadow">
      {/* <img srcSet={info?.posterUrl} src={fallbackImage} alt="poster" className="w-full rounded-tl-2 rounded-tr-2 aspect-[16:9]" /> */}
      <Image
        preview={false}
        src={info?.posterUrl}
        alt="poster"
        className="w-full rounded-tl-2 rounded-tr-2 aspect-[16:9]"
        fallback={fallbackImage}
        />

      <div className='px-4 pb-6 pt-4'>
        <div className="text-2xl mb-2">{info?.title}</div>
        <div className="mb-1">{dayjs(`${info.startTimestamp}000`).format('ddd, MMMM, MM, YYYY')}</div>
        <div className="mb-2">{dayjs(`${info.startTimestamp}000`).format('hh:mm A')} - {dayjs(`${info?.endTimestamp}1000`).format('hh:mm A')}</div>
        <Tags tags={info.tags} />
        <div className="frc-between gap-4 mt-4">
          <Button onClick={() => handleIterested()}>{info?.hasInterested ? 'interested' : 'I’m interested'}</Button>
          <div className="flex-1 frc-start ">
            <AvatarList avatarList={[]} />
            <span className="flex-1 whitespace-nowrap">xxx +{info.registrantsCount} on Booth is also going</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommandEventCard
