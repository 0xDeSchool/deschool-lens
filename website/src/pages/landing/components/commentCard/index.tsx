import type { FC } from 'react'
import { CommentCardIcon } from '~/components/icon'
import Image from 'antd/es/image'
import { getAssetsImage } from '~/utils/common'
import fallbackImage from '~/assets/images/fallbackImage'

interface CommentCardProps {
  id: number
  avatar: string
  name: string
  comment: string
  link?: string
}

interface ResouceDicType {
  [key: string | number]: string
}

// 关于动态引入图片问题require总是报错，所以在这里用字典做了一个转换，属于无奈之举
const imgDic: ResouceDicType = {
  firstavatar: getAssetsImage('review-avatar1.png'),
  secondeavatar: getAssetsImage('review-avatar2.png'),
  thirdavatar: getAssetsImage('review-avatar3.png'),
  forthavatar: getAssetsImage('review-avatar4.png'),
}

const imgWebpDic: ResouceDicType = {
  firstavatar: getAssetsImage('review-avatar1.webp'),
  secondeavatar: getAssetsImage('review-avatar2.webp'),
  thirdavatar: getAssetsImage('review-avatar3.webp'),
  forthavatar: getAssetsImage('review-avatar4.webp'),
}

const colorDic: ResouceDicType = {
  0: '#01FA47',
  1: '#6525FF',
  2: '#00FFFF',
  4: '#FCFF57',
}

const CommentCard: FC<CommentCardProps> = props => {
  const { id, avatar, name, comment, link } = props
  return (
    // TODO: 这里的小卡片宽度依旧不能做到自适应
    <div className="w-8/12 md:w-8/12 lg:w-4/12 border border-#1818180f p-7 relative flex flex-row">
      <CommentCardIcon className="opacity-10 absolute right-0 top-0" fillcolor={colorDic[id % 5]} />
      <Image preview={false} className="w-11 h-11" alt="avatar" srcSet={imgWebpDic[avatar]} src={imgDic[avatar]} fallback={fallbackImage} />
      <div className="mx-5 w-[463px]">
        <p className="mb-0 text-#6525FF text-xl md:text-3xl uppercase ">{name}</p>
        <a className="mb-0 text-lg uppercase cursor-pointer hover:underline text-black" href={link} target="_blank" rel="noreferrer">
          {comment}
        </a>
      </div>
    </div>
  )
}

export default CommentCard
