import Avatar from 'antd/es/avatar'
import { useNavigate } from 'react-router'
import type { Creator } from '~/lib/types/app'

// import { useTranslation } from 'react-i18next'
type UsersAvatarsProps = {
  users: Creator[]
}

const UsersAvatars = (props: UsersAvatarsProps) => {
  const { users } = props
  const navigate = useNavigate()

  const handleJumpProfile = (url: string | undefined) => {
    if (url) navigate(`/profile/${url}`)
  }

  return (
    <div className="frc-center rounded-md font-ArchivoNarrow">
      {users.map((user, index) => (
        <div title={user.username} key={user.id}>
          <Avatar
            src={user.avatar}
            srcSet={user.avatar}
            size={32}
            style={{ transform: `translateX(-${10 * index}px)`, border: '2px solid white', cursor: 'pointer' }}
            onClick={() => {
              handleJumpProfile(user.id)
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default UsersAvatars
