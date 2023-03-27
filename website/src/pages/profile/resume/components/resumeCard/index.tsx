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
import { isMobile } from '~/utils/ua'

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
    <div className={`${isMobile() ? '' : 'pt-4 hover:bg-gray-50 '} md:px-4 rounded-md w-full`}>
      {/* Title */}
      <div className={`${isMobile() ? 'mb-20px' : ''} frc-between flex-wrap mb-2`}>
        {/* 展示用户编辑的项目和role */}
        {(data?.project && data?.role) && <div className='font-ArchivoNarrow-Medium my-2 text-20px frc-start'>
          {/* {data?.project?.icon && <img className='w-24px h-24px rounded-full mr-1' alt="project.icon" src={data?.project?.icon} />} */}
          <span className=''>{data?.project?.name}</span>
          <span className='ml-8px font-ArchivoNarrow-Medium'>{data.role}</span>
        </div>}
        {/* 兼容旧数据 */}
        {!(data?.project && data?.role) && <div className="font-bold my-2 text-20px">{data.title}</div>}
        {/* Period */}
        <div className={`${isMobile() ? 'text-16px text-#18181865' : 'italic'} whitespace-nowrap`}>
          {data.startTime?.year()} {data.startTime?.month() !== undefined ? monthNames[data.startTime?.month()] : ''}
          {' - '}
          {data.isPresent && 'Currently working here'}
          {!data.isPresent && data.endTime?.year()} {!data.isPresent && data.endTime?.month() !== undefined ? monthNames[data.endTime?.month()] : ''}
        </div>
      </div>

      {/* Descriptions */}
      <div className="mt-1 whitespace-pre-line overflow-auto text-18px text-#18181865 mb-24px">{data.description}</div>
      {/* SBTs Title */}
      {(data.proofs && data.proofs.length > 0) && <div className={`${isMobile() ? 'text-18px text-#8181885 mb-16px' : 'font-bold mt-8 mb-2'} `}>Proofs of Commitments</div>}
      {/* Proofs of Work */}
      <div className="flex justify-between w-full">
        <div className={`${isMobile() ? 'flex-unwrap frc-center ' : 'frc-start flex-wrap'} flex-1 w-full`}>
          {data.proofs &&
            data.proofs.map(item => (
              <div
                key={`sbt-${item.address}-${item.tokenId}`}
                className={`${isMobile() ? 'flex-1 frc-center max-w-110px max-h-110px' : 'w-[110px] frc-start'}  mr-2 relative`}>
                <div
                  className="frc-center w-full h-full hover:cursor-pointer p-1 border border-white hover:border-#6525FF"
                  onClick={() => navigate(`/sbtIntro/${item.address}/${item.tokenId}`)}
                >
                  <img
                    className={isMobile() ? 'w-full h-full min-w-48px min-h-48px max-w-160px max-h-160px rounded-6px aspect-[1/1]' : 'w-100px h-100px'}
                    style={{borderRadius: '4px'}}
                    src={item.img} fallback={fallbackImage} preview={false} />
                  {!isMobile() && <div style={{ position: 'absolute', bottom: '0px', right: '0px' }}>
                    <VerifiedIcon style={{ color: blockType === BlockType.CareerBlockType ? '#009411' : '#266DE0', fontSize: 22 }} />
                  </div>}
                </div>
              </div>
            ))}
        </div>
        {/* 删除本 Card Icon */}
        {isEditResume && <div className="flex flex-col justify-end">
          <div className="w-90px flex justify-between">
            <EditOutlined
              onClick={() => handleEditCard(data.blockType, data.id)}
              className="text-blue-4 hover:text-blue-6! w-40px h-40px hover:rounded-full hover:bg-blue-2 hover:border hover:border-blue-3 frc-center"
            />
            <DeleteOutlined
              color="red"
              onClick={showDeleteConfirm}
              className="text-red-4 hover:text-red-6! w-40px h-40px hover:rounded-full hover:bg-red-2 hover:border hover:border-red-3 frc-center"
            />
          </div>
        </div>}
      </div>
      {/* {(data.proofs && data?.proofs?.length > 0) && <div className='w-full frc-center text-18px text-#18181885'>Proofs of Commitments</div>} */}

      {/* Divider */}
      <Divider />
    </div>
  )
}

export default ResumeCard
