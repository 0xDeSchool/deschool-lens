type FollowersProp = {
    handle?: string
  }
  
  const Following = (props: FollowersProp) => {
    const { handle } = props
    return <div>Activities Handle: {handle}</div>
  }
  export default Following
  