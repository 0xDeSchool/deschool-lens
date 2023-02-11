type FollowersProp = {
  handle?: string
}

const Followers = (props: FollowersProp) => {
  const { handle } = props
  return <div>Activities Handle: {handle}</div>
}
export default Followers
