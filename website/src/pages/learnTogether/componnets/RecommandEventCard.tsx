import Button from 'antd/es/button'
import Image from 'antd/es/image'
import SkeletonImage from 'antd/es/skeleton/Image'
import dayjs from 'dayjs'
import { useAccount } from '~/account'
import { interestEvent } from '~/api/booth/event'
import { MatchedEvent } from '~/hooks/useCCProfile'
import fallbackImage from '~/assets/images/fallbackImage'
import AvatarList from './AvatarList'
import Tags from './Tags'

type RecommandEventCardProps = {
  info: MatchedEvent
  refresh: () => void
}

const RecommandEventCard: React.FC<RecommandEventCardProps> = (props) => {
  const { info, refresh } = props
  const account = useAccount()

  const handleIterested = async () => {
    if (account) {
      await interestEvent({
        targetId: info.id,
        userId: account.id,
      })
      refresh()
    }
    window.open(`https://link3.to/e/${info.id}`)
  }

  return (
    <div className="flex-1 rounded-2 max-w-520px bg-white shadow">
      {/* <img srcSet={info?.posterUrl} src={fallbackImage} alt="poster" className="w-full rounded-tl-2 rounded-tr-2 aspect-[16:9]" /> */}
      <div className="max-w-520px w-520px h-292px rounded-tl-2 rounded-tr-2 aspect-[16:9]">
        <Image
          preview={false}
          alt="poster"
          src={info?.posterUrl}
          className="w-100% h-100% rounded-tl-2 rounded-tr-2 aspect-[16:9]"
          fallback={fallbackImage}
          width={'100%'}
          height={'100%'}
          placeholder={
            <div
              style={{ width: '100%', height: '100%' }}
              className="w-100% h-100% rounded-tl-2 rounded-tr-2 aspect-[16:9] bg-gray-300"
            />
          }
        />
      </div>
      <div className='px-4 pb-6 pt-4'>
        <div className="text-2xl mb-2">{info?.title}</div>
        <div className="mb-1">{dayjs(`${info.startTimestamp}000`).format('ddd, MMMM, MM, YYYY')}</div>
        <div className="mb-2">{dayjs(`${info.startTimestamp}000`).format('hh:mm A')} - {dayjs(`${info?.endTimestamp}1000`).format('hh:mm A')}</div>
        <Tags tags={info.tags} />
        <div className="frc-between gap-4 mt-4 ">
          <Button className='w-120px' disabled={info?.hasInterested} onClick={() => handleIterested()}>{info?.hasInterested ? 'interested' : 'I’m interested'}</Button>
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
