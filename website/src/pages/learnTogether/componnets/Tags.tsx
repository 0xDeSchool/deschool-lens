const Tags = ({ tags }: {tags: string[]}) => (
  <div className='frc-start gap-4'>
    {tags?.map((tag: string) => (
      <div className="frc-center gap-1" key={`${tag}`}>
        <span>🏷️</span><span className="font-500">{tag}</span>
      </div>
    ))}
  </div>
)

export default Tags
