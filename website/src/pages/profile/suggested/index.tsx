type SuggestProp = {
  handle?: string
}

const Suggest = (props: SuggestProp) => {
  const { handle } = props
  return <div className="text-black w-full h-200px">Suggest Handle: {handle}</div>
}
export default Suggest
