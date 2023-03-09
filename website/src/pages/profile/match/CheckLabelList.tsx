import Tag from 'antd/es/tag'

const { CheckableTag } = Tag

export const CheckLabelList = ({ labels, changeLabel, label, className = '' }: any) =>
  labels.map((tag: string) => (
    <CheckableTag
      key={tag}
      checked={label === tag}
      onChange={checked => changeLabel(tag, checked)}
      className={`${className} rounded-xl px-4 py-0.5 font-ArchivoNarrow`}
    >
      {tag}
    </CheckableTag>
  ))
