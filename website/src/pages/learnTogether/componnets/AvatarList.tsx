import Avatar from 'antd/es/avatar'

type AvatarListProps = {
  avatarList: { avatar: string, displayName: string }[]
  size?: number
  onClick?: (index: number) => void
}

const AvatarList: React.FC<AvatarListProps> = (props) => {
  const { avatarList, size = 24, onClick } = props
  return (
    <div className="frc-start flex-0 translate-x-10px">
      {avatarList?.map((v, index: number) => (
          <Avatar
            key={`${index}-${v.avatar}`}
            src={v.avatar}
            size={size}
            style={{ transform: `translateX(-${10 * index}px)`, border: '2px solid white', cursor: 'pointer' }}
            onClick={() => {
              onClick && onClick(index)
            }}
            alt={v.displayName}
          />
        ))}
    </div>
  )
}

export default AvatarList
