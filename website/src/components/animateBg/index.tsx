import style from './animate.module.css'

const AnimateBg = (props: { type?: 'line' }) => {
  const { type } = props
  if (type && type === 'line') {
    return (
      <div className='relative w-full h-full overflow-hidden'>
        <div className={`${style.light} ${style.x1}`}/>
        <div className={`${style.light} ${style.x2}`} />
        <div className={`${style.light} ${style.x3}`} />
        <div className={`${style.light} ${style.x4}`} />
        <div className={`${style.light} ${style.x5}`} />
        <div className={`${style.light} ${style.x6}`} />
        <div className={`${style.light} ${style.x7}`} />
        <div className={`${style.light} ${style.x8}`} />
        <div className={`${style.light} ${style.x9}`} />
      </div>
    )
  }
  return (
    <div className={style.area}>
      <ul className={style.circles}>
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>
    </div>
  )
}

export default AnimateBg
