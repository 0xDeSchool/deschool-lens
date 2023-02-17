import style from './randomAvatar.module.css'

const RandomAvatar = (props: any) => {
  const randomY = Math.floor(Math.random() * 4 + 1)
  const randomX = Math.floor(Math.random() * 14 + 1)

  return (
    <div {...props}>
      <div className={style.emoji} style={{ backgroundPosition: `-${randomX * 84}px -${randomY * 84}px` }}>
        {' '}
      </div>
    </div>
  )
}

export default RandomAvatar
