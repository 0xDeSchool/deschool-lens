const Tags = ({ tags }: {tags: string[]}) => {
  return (
    <div className='frc-start gap-4'>
      {tags?.map((tag: string, index: number) => {
        return (
          <div className="frc-center gap-1" key={`${index}-${tag}`}>
            <span>🏷️</span><span className="font-500">{tag}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Tags
