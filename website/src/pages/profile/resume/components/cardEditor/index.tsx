import React, { useState } from 'react'
import Modal from 'antd/es/modal'
import Form from 'antd/es/form'
import Input from 'antd/es/input'
import DatePicker from 'antd/es/date-picker'
import Image from 'antd/es/image'
import VerifiedIcon from '@mui/icons-material/Verified'
import type { CardEditorInput, EditorDataType } from '../../types'

const { TextArea } = Input

// TODO: Clean up this
const TEST_SBT_IMG_LIST = [
  'https://i.seadn.io/gcs/files/f109bda89f825153017f7ebd60ae3491.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/c113f73ea333dd0e89456aa5b6da115e.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/c88244faa5fc9564a1a8fb53f8e72976.jpg?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/388ded25ee73b3ab0dc06cb5d7b8419f.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/2355e5f59968783224d3880925406ef0.png?auto=format&w=1000',
  'https://i.seadn.io/gae/i4o36ySrEAMpG_JnooCP7rtJEfd8nGUgvwWZuc5XsctyUZ3eJr0kv9BCGORQor5xkJsMFkYJNBVGBrBRjWXm0DmrwoHeQMcTN6te?auto=format&w=1000',
]

const SbtItem = (props: { list: string[]; toggleList: (key: string) => void; item: string }) => {
  const { list, toggleList, item } = props
  const key = `sbt-${item}`
  const isInList = (str: string) => list.includes(str)

  return (
    <div
      key={key}
      className={`aspect-square border-2 
      cursor-pointer ${isInList(key) ? 'border-#6525FF bg-gray-100' : 'border-black'}`}
      onClick={() => toggleList(key)}
    >
      <Image src={item} preview={false} />
      <div className="flex justify-end" style={{ position: 'relative' }}>
        {list.includes(key) && (
          <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
            <VerifiedIcon style={{ color: '#6525FF', fontSize: 22 }} />
          </div>
        )}
      </div>
    </div>
  )
}

const SbtSelectList = () => {
  const [list, setList] = useState<string[]>([])

  const toggleList = (key: string) => {
    const newList = list.slice()
    if (list.includes(key)) {
      const index = list.indexOf(key)
      newList.splice(index, 1)
    } else {
      newList.push(key)
    }
    setList(newList)
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {TEST_SBT_IMG_LIST.map(item => (
        <SbtItem key={`sbt-${item}`} list={list} toggleList={toggleList} item={item} />
      ))}
    </div>
  )
}

const CardEditor = (input: CardEditorInput) => {
  const [data, setData] = useState<EditorDataType>({
    title: '',
    startTime: '',
    endTime: '',
  })
  const [form] = Form.useForm()

  const onStartTimeChange = (dayJsValue: any, newDateStr: string) => {
    const newData = data
    newData.startTime = newDateStr
    setData(newData)
  }

  return (
    <Modal title="Edit experience" open={input.isEditCard} onOk={input.handleOk} onCancel={input.handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label='Experience Title (eg "ECO Partner", "Product Lead", etc.)'>
          <Input />
        </Form.Item>
        <Form.Item label="Starting Time">
          <DatePicker onChange={onStartTimeChange} picker="month" />
        </Form.Item>
        <Form.Item label="End Time">
          {/* TODO: Change into endTimeChange */}
          <DatePicker onChange={onStartTimeChange} picker="month" />
        </Form.Item>
        <Form.Item label="Description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Available On-chain Proofs">
          <SbtSelectList />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CardEditor
