import React from 'react'
import Image from 'antd/es/image'
import Modal from 'antd/es/modal'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import VerifiedIcon from '@mui/icons-material/Verified'
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

// TODO: Clean up this
const TEST_TITLE = 'Fullstack Engineer - DeSchool'
// TODO: Clean up this
const TEST_DESC =
  'Driven and well-organized e-commerce executive with 7+ years of experience. Passionate about developing new businesses and planning marketing strategies. Seeks to boost and redefine ABC Inc.’s KPIs. At DEF Inc. increased revenue by 30%, boosted ROI 40% YOY, slashed yearly costs by 25%. At GHI Inc. expanded business by 80%.'

const ResumeCard = (input: ResumeCardInput) => {
  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this experience?',
      icon: <ExclamationCircleFilled />,
      content: 'Once click "Delete", this experience card will be fully deleted.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        console.log('OK')
        input.handleDeleteCard()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <div className="mt-2">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="font-bold my-2">{TEST_TITLE}</div>
        <div>Jan 22 - Feb 23</div>
      </div>
      {/* Period */}
      {/* Descriptions */}
      <div className="mt-1">{TEST_DESC}</div>
      {/* SBTs Title */}
      <div className="font-bold my-2">Proofs of Commitments</div>

      <div className="flex justify-between">
        <div className="">
          <div className="w-[52px]" style={{ position: 'relative' }}>
            <Image width={50} src={TEST_SBT_IMG_LIST[1]} />
            <div style={{ position: 'absolute', bottom: '0px', right: '0px' }}>
              <VerifiedIcon style={{ color: input.blockType === BlockType.CareerBlockType ? '#009411' : '#266DE0', fontSize: 22 }} />
            </div>
          </div>
        </div>
        {/* 删除本 Card Icon */}
        <div className="flex flex-col justify-end">
          <div className="w-12 flex justify-between">
            {input.isEditBlock && <EditOutlined onClick={input.handleEditCard} />}
            {input.isEditBlock && <DeleteOutlined color="red" onClick={showDeleteConfirm} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeCard
