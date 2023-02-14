type VerifiedProp = {
  handle?: string
}

const Verified = (props: VerifiedProp) => {
  const { handle } = props
  return <div>Verified Handle: {handle}</div>
}
export default Verified
