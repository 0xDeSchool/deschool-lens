type ActivitiesProp = {
  handle?: string
}

const Activities = (props: ActivitiesProp) => {
  const { handle } = props
  return <div>Activities Handle: {handle}</div>
}
export default Activities
