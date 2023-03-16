import React from 'react'
import Image from 'antd/es/image'
import Modal from 'antd/es/modal'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import VerifiedIcon from '@mui/icons-material/Verified'
import Divider from 'antd/es/divider'
import { useNavigate } from 'react-router'
import fallbackImage from '~/assets/images/fallbackImage'
import type { ResumeCardInput } from '../../types'
import { BlockType } from '../../enum'

const { confirm } = Modal

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const ResumeCard = (input: ResumeCardInput) => {
  const { isEditResume, handleDeleteCard, data, blockType, handleEditCard } = input
  const navigate = useNavigate()

  const showDeleteConfirm = () => {
    confirm({
      title: 'Sure?',
      icon: <ExclamationCircleFilled />,
      content: 'This experience is going to be deleted',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        if (data.id !== undefined) {
          handleDeleteCard(blockType, data.id)
        }
      },
    })
  }

  return (
    <div className="pt-4 px-4 hover:bg-gray-50 rounded-md w-full">
      {/* Title */}
      <div className="flex justify-between items-center">
        {/* 展示用户编辑的项目和role */}
        {(data?.project && data?.role) && <div className='font-bold my-2 text-lg'>
          <span>{data?.project?.name}</span>
          <span className='ml-4 font-ArchivoNarrow-Medium'>{data.role}</span>
        </div>}
        {/* 兼容旧数据 */}
        {!(data?.project && data?.role) && <div className="font-bold my-2 text-lg">{data.title}</div>}
        {/* Period */}
        <div className="italic">
          {data.startTime?.year()} {data.startTime?.month() !== undefined ? monthNames[data.startTime?.month()] : ''}
          {' - '}
          {data.isPresent && 'Currently working here'}
          {!data.isPresent && data.endTime?.year()} {!data.isPresent && data.endTime?.month() !== undefined ? monthNames[data.endTime?.month()] : ''}
        </div>
      </div>

      {/* Descriptions */}
      <div className="mt-1">{data.description}</div>
      {/* SBTs Title */}
      {data.proofs && data.proofs.length > 0 && <div className="font-bold mt-8 mb-2">Proofs of Commitments</div>}
      {/* Proofs of Work */}
      <div className="flex justify-between">
        <div className="flex flex-wrap flex-1">
          {data.proofs &&
            data.proofs.map(item => (
              <div key={`sbt-${item.address}-${item.tokenId}`} className="w-[110px] mr-2 relative">
                <div
                  className="hover:cursor-pointer p-1 border border-white hover:border-#6525FF"
                  onClick={() => navigate(`/sbtIntro/${item.address}/${item.tokenId}`)}
                >
                  <Image wrapperClassName='w-100px h-100px' src={item.img} fallback={fallbackImage} preview={false} />
                  <div style={{ position: 'absolute', bottom: '0px', right: '0px' }}>
                    <VerifiedIcon style={{ color: blockType === BlockType.CareerBlockType ? '#009411' : '#266DE0', fontSize: 22 }} />
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* 删除本 Card Icon */}
        <div className="flex flex-col justify-end">
          <div className="w-90px flex justify-between">
            {isEditResume && (
              <EditOutlined
                onClick={() => handleEditCard(data.blockType, data.id)}
                className="text-blue-4 hover:text-blue-6! w-40px h-40px hover:rounded-full hover:bg-blue-2 hover:border hover:border-blue-3 frc-center"
              />
            )}
            {isEditResume && (
              <DeleteOutlined
                color="red"
                onClick={showDeleteConfirm}
                className="text-red-4 hover:text-red-6! w-40px h-40px hover:rounded-full hover:bg-red-2 hover:border hover:border-red-3 frc-center"
              />
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <Divider />
    </div>
  )
}

export default ResumeCard
