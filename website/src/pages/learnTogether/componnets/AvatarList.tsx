import Avatar from 'antd/es/avatar'

type AvatarListProps = {
  avatarList: string[]
  size?: number
  onClick?: (index: number) => void
}

const AvatarList: React.FC<AvatarListProps> = (props) => {
  const { avatarList, size = 24, onClick } = props
  return (
    <div className="frc-start flex-0 translate-x-10px">
      {avatarList?.map((avatar: string, index: number) => {
        return (
          <Avatar
            key={`${index}-${avatar}`}
            src={avatar}
            size={size}
            style={{ transform: `translateX(-${10 * index}px)`, border: '2px solid white', cursor: 'pointer' }}
            onClick={() => {
              onClick && onClick(index)
            }}
          />
        )
      })}
    </div>
  )
}

export default AvatarList
