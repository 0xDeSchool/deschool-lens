import Image from 'antd/es/image'
import { DEFAULT_AVATAR } from '~/account';

const LensAvatar = (props: { wrapperClassName?: string; avatarUrl?: string; size?: number }) => {
  const { wrapperClassName, avatarUrl, size } = props
  return avatarUrl ? (
    <Image
      preview={false}
      src={avatarUrl}
      fallback={DEFAULT_AVATAR}
      alt="avatar"
      style={{ width: size || 80, height: size || 80 }}
      className="rounded-full border border-4 border-white shadow-lg"
      wrapperClassName={wrapperClassName || 'absolute bottom--40px fcc-center w-full'}
    />
  ) : (
    <Image
      preview={false}
      src={DEFAULT_AVATAR}
      alt="avatar"
      style={{ width: size || 80, height: size || 80 }}
      className="rounded-full border border-4 border-white shadow-lg"
      wrapperClassName={wrapperClassName || 'absolute bottom--40px fcc-center w-full'}
    />
  )
}

export default LensAvatar
