import Avatar from 'antd/es/avatar'
import Tooltip from 'antd/es/tooltip'
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
    navigate(`/profile/${user.address}/resume`)
  }
  return (
    <div className="frc-start flex-0 translate-x-10px">
      {avatarList?.map((v, index: number) => (
        <Tooltip key={v.id} title={v.displayName || v.name || v.address}>
          <Avatar
            src={v.avatar ? v.avatar : DEFAULT_AVATAR}
            size={size}
            style={{
              transform: `translateX(-${10 * (index + 1)}px)`,
              border: '2px solid white',
              cursor: 'pointer',
            }}
            onClick={() => goProfile(v)}
            alt={v.displayName}
          />
        </Tooltip>
      ))}
    </div>
  )
}
export default AvatarList
