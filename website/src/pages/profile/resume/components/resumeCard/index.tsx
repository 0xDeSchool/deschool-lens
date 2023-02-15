import React from 'react'
import Image from 'antd/es/image'
import Modal from 'antd/es/modal'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import VerifiedIcon from '@mui/icons-material/Verified'
import Divider from 'antd/es/divider'
import type { ResumeCardInput } from '../../types'
import { BlockType } from '../../enum'

const { confirm } = Modal

// TODO: Clean up this
const TEST_SBT_IMG_LIST = [
  'https://i.seadn.io/gcs/files/f109bda89f825153017f7ebd60ae3491.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/c113f73ea333dd0e89456aa5b6da115e.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/c88244faa5fc9564a1a8fb53f8e72976.jpg?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/388ded25ee73b3ab0dc06cb5d7b8419f.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/2355e5f59968783224d3880925406ef0.png?auto=format&w=1000',
  'https://i.seadn.io/gae/i4o36ySrEAMpG_JnooCP7rtJEfd8nGUgvwWZuc5XsctyUZ3eJr0kv9BCGORQor5xkJsMFkYJNBVGBrBRjWXm0DmrwoHeQMcTN6te?auto=format&w=1000',
]

// const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

  const showDeleteConfirm = () => {
    confirm({
      title: 'Sure to delete?',
      icon: <ExclamationCircleFilled />,
      content: 'Once click "Delete", this experience card will be fully deleted.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        if (data.order !== undefined) {
          handleDeleteCard(blockType, data.order)
        }
      },
    })
  }

  return (
    <div className="my-4">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="font-bold my-2 text-lg">{data.title}</div>
        {/* Period */}
        <div>
          {data.startTime?.year()} {data.startTime?.month() !== undefined ? monthNames[data.startTime?.month()] : ''}
          {' - '}
          {data.endTime?.year()} {data.endTime?.month() !== undefined ? monthNames[data.endTime?.month()] : ''}
        </div>
      </div>

      {/* Descriptions */}
      <div className="mt-1">{data.description}</div>

      {/* SBTs Title */}
      <div className="font-bold my-4">Proofs of Commitments</div>

      {/* Proofs of Work */}
      <div className="flex justify-between">
        <div className="">
          <div className="w-[52px]" style={{ position: 'relative' }}>
            {/* TODO: */}
            <Image width={50} src={TEST_SBT_IMG_LIST[1]} />
            <div style={{ position: 'absolute', bottom: '0px', right: '0px' }}>
              <VerifiedIcon style={{ color: blockType === BlockType.CareerBlockType ? '#009411' : '#266DE0', fontSize: 22 }} />
            </div>
          </div>
        </div>
        {/* 删除本 Card Icon */}
        <div className="flex flex-col justify-end">
          <div className="w-12 flex justify-between">
            {isEditResume && <EditOutlined onClick={() => handleEditCard(data.blockType, data.order)} />}
            {isEditResume && <DeleteOutlined color="red" onClick={showDeleteConfirm} />}
          </div>
        </div>
      </div>

      {/* Divider */}
      <Divider />
    </div>
  )
}

export default ResumeCard
