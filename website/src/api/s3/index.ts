import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import message from 'antd/es/message'
import { v4 as uuidv4 } from 'uuid'
import type { ImageType } from 'react-images-uploading/dist/typings'

const AWS_REGION = import.meta.env.VITE_APP_REGION
const IDENTITY_POOL_ID = import.meta.env.VITE_APP_IDENTITYPOOLID
// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: AWS_REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
})
const BUCKET_NAME = import.meta.env.VITE_APP_BUCKET_NAME as string

// Add a photo to an album
const addPhoto = async (
  albumName: string,
  file: File,
  filename: string,
  imagetype: string,
  onChange: Function,
  setIsLoading: Function,
  userId: string,
) => {
  try {
    const uuid = `${userId}${uuidv4()}`
    const extentions = file?.name?.split('.')?.pop()
    const resourceKey = `${albumName}/${uuid}.${extentions}`
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: resourceKey,
      Body: file,
      ContentType: imagetype,
    }

    try {
      setIsLoading(true)
      await s3.send(new PutObjectCommand(uploadParams))
      onChange([{ data_url: `https://s3.us-east-1.amazonaws.com/deschool/${resourceKey}`, filename: `${uuid}` }], 'add')
      message.success('Successfully uploaded photo.')
    } catch (err) {
      if (err instanceof Error) {
        return message.error(`There was an error uploading your photo: ${err.message}`)
      }
      return message.error('There was an error uploading your photo.')
    }
  } catch (err) {
    if (!file) {
      return message.error('Choose a file to upload first.')
    }
  } finally {
    setIsLoading(false)
  }
}

// 为了展示loading状态多加了一个参数setIsLoading
const onUploadChange = (albumname: string, imageList: ImageType[], onChange: Function, setIsLoading: Function, userId: string) => {
  const image: ImageType = imageList[0]
  if (image && image.file) {
    const isLt2M = image.file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    } else {
      addPhoto(albumname, image.file, image.file.name, image.file.type, onChange, setIsLoading, userId)
    }
  }
}

const onDelete = async (albumName: string, filename: string, imageList: ImageType[], deleteIndex: number, onChange: Function) => {
  try {
    const albumPhotosKey = `${albumName}/${filename}`
    const resourceKey = albumPhotosKey
    const params = { Key: resourceKey, Bucket: BUCKET_NAME }
    await s3.send(new DeleteObjectCommand(params))
    message.success('Successfully deleted photo.')
    const temp = imageList.slice()
    temp.splice(deleteIndex, 1)
    onChange(temp, 'delete')
  } catch (err) {
    if (err instanceof Error) {
      return message.error(`There was an error deleting your photo: ${err.message}`)
    }
  }
}

type UploadPictureParams = {
  file: File
  albumName: string
  userId: string
  start?: () => void
  success?: (urls: string) => void
  fail?: (err: Error) => void
  complete?: () => void
}

const uploadPicture = async (params: UploadPictureParams) => {
  const { file, userId, albumName } = params
  try {
    const extentions = file?.name?.split('.')?.pop()
    const uuid = `${userId}${uuidv4()}.${extentions}`
    const albumPhotosKey = `${albumName}/${uuid}`
    const resourceKey = albumPhotosKey
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: resourceKey,
      Body: file,
      ContentType: file?.type,
    }

    try {
      // 开始上传
      if (params.start) {
        params.start()
      }
      await s3.send(new PutObjectCommand(uploadParams))
      // 上传成功
      if (params.success) {
        params.success(`https://${BUCKET_NAME}.s3.amazonaws.com/${resourceKey}`)
      }
    } catch (err) {
      // 上传失败
      let msg = 'There was an error uploading your photo.'
      if (err instanceof Error) {
        if (params.fail) {
          msg = `There was an error uploading your photo: ${err.message}`
        }
      }
      if (params.fail) {
        params.fail(new Error(msg))
      }
    }
  } catch (err) {
    // 未选择文件
    if (!file) {
      if (params.fail) {
        params.fail(new Error('Choose a file to upload first.'))
      }
    }
    // 上传失败
    else if (err instanceof Error) {
      if (params.fail) {
        params.fail(err)
      }
    }
  } finally {
    // 上传完成
    if (params.complete) {
      params.complete()
    }
  }
}

export { onUploadChange, addPhoto, onDelete, uploadPicture }
