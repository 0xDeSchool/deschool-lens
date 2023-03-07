import Avatar from 'antd/es/avatar'
import { useNavigate } from 'react-router'
import { DEFAULT_AVATAR } from '~/account'
import { EventUserItem } from '~/api/booth/event'

type AvatarListProps = {
  avatarList: EventUserItem[]
  size?: number
}


const AvatarList: React.FC<AvatarListProps> = (props) => {
  const { avatarList, size = 24 } = props
  const navigate = useNavigate()
  const goProfile = (user: EventUserItem) => {
    debugger
    navigate(`/profile/${user.address}`)
  }
  return (
    <div className="frc-start flex-0 translate-x-10px">
      {avatarList?.map((v, index: number) => (
        <Avatar
          key={v.id}
          src={v.avatar ? v.avatar : DEFAULT_AVATAR}
          size={size}
          style={{ transform: `translateX(-${10 * index}px)`, border: '2px solid white', cursor: 'pointer' }}
          onClick={() => goProfile(v)}
          alt={v.displayName}
        />
      ))}
    </div>
  )
}
export default AvatarList
