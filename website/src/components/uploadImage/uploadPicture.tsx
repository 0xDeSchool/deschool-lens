import type { ImgCropProps } from 'antd-img-crop'

import ImgCrop from 'antd-img-crop'
import type { Ref } from 'react'
import { useEffect, useImperativeHandle, forwardRef, useState } from 'react'
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'
import Upload from 'antd/es/upload'
import { uploadPicture } from '~/api/s3'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import CloudUploadOutlined from '@ant-design/icons/lib/icons/CloudUploadOutlined'
import UploadIcon from '~/assets/icons/upload.png'
import message from 'antd/es/message'
import { LoadingOutlined } from '@ant-design/icons'

type UploadPictureProps = {
  width?: number
  height?: number
  className?: string
  albumname: string
  userId: string | undefined
  imageList?: string[]
  limitSize?: number
  uploadProps?: UploadProps
  imgCropProps?: Partial<ImgCropProps>
  nocrop?: boolean
  onChange: (value: any[]) => void
  onChangeStatus?: (status: boolean) => void
}

type UploadPictureRef = {
  setDefaltUrls: (urls: string[]) => void
}
const UploadPicture = forwardRef((props: UploadPictureProps, ref: Ref<UploadPictureRef>) => {
  const { imageList, width, height, albumname, userId, className, onChange, onChangeStatus, limitSize, imgCropProps, uploadProps, nocrop } =
    props
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [visible, setVisible] = useState(false)
  const setDefaultUrls = (urls: string[]) => {
    const tempImageList: UploadFile[] = []
    urls?.forEach(item => {
      tempImageList.push({
        uid: item,
        name: 'image.png',
        status: 'done',
        url: item,
      })
    })
    setFileList(tempImageList)
  }

  useEffect(() => {
    // 有默认值时，设置默认值
    setDefaultUrls(imageList || [])
  }, [imageList])

  // 上传状态改变
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      if (onChangeStatus) {
        onChangeStatus(true)
      }
      setFileList([])
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setLoading(false)
      if (onChangeStatus) {
        onChangeStatus(false)
      }
      let newFileList = [...info.fileList]
      newFileList = newFileList.slice(-1)
      newFileList = newFileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response
        }
        return file
      })
      setFileList(newFileList)
    }
  }

  const style = {
    width: `${width || 120}px`,
    minWidth: `${width || 120}px`,
    height: `${height || 120}px`,
    minHeight: `${height || 120}px`,
  }

  // 上传前校验 限制大小 限制类型
  const handleBeforeUpload = (file: RcFile) => {
    const fileLimitSize = limitSize || 2 * 1024 * 1024 // 默认2M
    const acceptTypeDefault = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']
    const isAcceptType = acceptTypeDefault.includes(file.type)
    if (!isAcceptType) {
      message.error('You can only upload JPG/JPEG/GIF/PNG file!')
    }
    const isLtSizeM = file.size < fileLimitSize
    if (!isLtSizeM) {
      message.error(`Image must smaller than ${limitSize || 2}MB!`)
    }
    return isAcceptType && isLtSizeM
  }

  // 上传列表 自定义交互图标
  const showUploadList = uploadProps?.multiple
    ? {
        showPreviewIcon: true,
        showRemoveIcon: true,
        removeIcon: <DeleteOutlined />,
      }
    : false

  const customUploadProps: UploadProps = {
    ...uploadProps,
    style,
    listType: 'picture-card',
    defaultFileList: [...fileList],
    beforeUpload: handleBeforeUpload,
    async customRequest(option: any) {
      uploadPicture({
        albumName: albumname,
        userId: userId || '',
        file: option.file,
        start: () => {
          setLoading(true)
          if (onChangeStatus) {
            onChangeStatus(true)
          }
        },
        success: (val: string) => {
          option.onSuccess(val, option.file)
          onChange([val])
        },
        fail: option.onError,
        complete: () => {
          setLoading(false)
          if (onChangeStatus) {
            onChangeStatus(false)
          }
        },
      })
    },
    onChange: handleChange,
    showUploadList,
  }

  useImperativeHandle(ref, () => ({
    setDefaltUrls: (val: string[]) => {
      setDefaultUrls(val)
    },
  }))

  const uploadButton = (
    <div className="flex flex-col justify-center items-center border-black border-2" style={style}>
      {loading ? <LoadingOutlined /> : <img src={UploadIcon} style={{ width: '36px', height: '32px' }} alt="upload icon" />}
      <button type="button" className="mt-2 px-2 flex flex-col items-center justify-center">
        {(loading && (width && width >= 120)) && 'Uploading'}
        {!loading && (!height || height > 120) && (
          <>
            <span>DRAG OR CLICK</span>
            <span>TO UPLOAD</span>
          </>
        )}
      </button>
    </div>
  )

  const imgCropPropsDefault = {
    fillColor: 'rgba(0, 0, 0, 0)', // 裁剪框背景色默认透明度为0
    ...imgCropProps,
  }
  if (nocrop) {
    return (
      <div style={style} className={className}>
        <Upload {...customUploadProps}>
          {fileList.length > 0 ? (
            <div
              className="relative flex items-center justify-center"
              style={style}
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}
              onMouseOver={() => setVisible(true)}
              onFocus={() => setVisible(true)}
            >
              <div className="absolute top-0 right-0 left-0 bottom-0 z-1 bg-transparent hover:bg-black/25 flex flex-col items-center justify-center">
                <CloudUploadOutlined style={{ fontSize: 32, color: visible ? 'white' : 'transparent' }} />
                <span style={{ color: visible ? 'white' : 'transparent' }}>{loading ? 'uploading' : 'upload'}</span>
              </div>
              <img src={fileList[0].url} alt="series cover" className={imgCropProps?.shape === 'round' ? 'rounded-full' : ''} />
            </div>
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
    )
  }
  return (
    <div style={style} className={className}>
      <ImgCrop {...imgCropPropsDefault}>
        <Upload {...customUploadProps}>
          {fileList.length > 0 ? (
            <div
              className="relative flex items-center justify-center"
              style={style}
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}
              onMouseOver={() => setVisible(true)}
              onFocus={() => setVisible(true)}
            >
              <div className="absolute top-0 right-0 left-0 bottom-0 z-1 bg-transparent hover:bg-black/25 flex flex-col items-center justify-center">
                <CloudUploadOutlined style={{ fontSize: 32, color: visible ? 'white' : 'transparent' }} />
                <span style={{ color: visible ? 'white' : 'transparent' }}>{loading ? 'uploading' : 'upload'}</span>
              </div>
              <img
                src={fileList[0].url}
                alt="series cover"
                style={style}
                className={`object-contain ${imgCropProps?.shape === 'round' ? 'rounded-full' : ''}`}
              />
            </div>
          ) : (
            uploadButton
          )}
        </Upload>
      </ImgCrop>
    </div>
  )
})

export default UploadPicture
