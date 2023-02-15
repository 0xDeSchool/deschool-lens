import React, { useEffect, useState } from 'react'
import Modal from 'antd/es/modal'
import Form from 'antd/es/form'
import Input from 'antd/es/input'
import dayjs from 'dayjs'
import DatePicker from 'antd/es/date-picker'
import Image from 'antd/es/image'
import VerifiedIcon from '@mui/icons-material/Verified'
import type { CardEditorInput, ResumeCardData, SbtInfo } from '../../types'

const { TextArea } = Input

const SbtItem = (props: { list: string[]; toggleList: (key: string) => void; item: SbtInfo }) => {
  const { list, toggleList, item } = props
  const key = `sbt-${item.address}-${item.tokenId}`
  const isInList = (str: string) => list.includes(str)

  return (
    <div
      key={key}
      className={`aspect-square border-2 
      cursor-pointer ${isInList(key) ? 'border-#6525FF bg-gray-100' : 'border-black'}`}
      onClick={() => toggleList(key)}
    >
      <Image src={item.img} preview={false} />
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

const SbtSelectList = (props: { sbtList: SbtInfo[]; originalList: SbtInfo[] | undefined; setProofs: (list: SbtInfo[]) => void }) => {
  const [list, setList] = useState<string[]>([])
  const { sbtList, originalList, setProofs } = props

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

  // 预加载时，load 已经选择了的 img
  useEffect(() => {
    if (!originalList) {
      return
    }
    const loadedList: string[] = []
    sbtList.forEach(listItem => {
      const index = originalList.findIndex(
        originalItem => originalItem.address === listItem.address && originalItem.tokenId === listItem.tokenId,
      )
      if (index !== -1) {
        loadedList.push(`sbt-${listItem.address}-${listItem.tokenId}`)
      }
    })
    setList(loadedList)
  }, [])

  //
  useEffect(() => {
    const newProofs: SbtInfo[] = []
    for (let i = 0; i < list.length; i++) {
      const key = list[i]
      const pieces = key.split('-')
      if (pieces.length < 3) {
        continue
      }
      const sbt = sbtList.find(item => item.address === pieces[1] && item.tokenId === pieces[2])
      if (!sbt) {
        continue
      }
      newProofs.push(sbt)
    }
    setProofs(newProofs)
  }, [list])

  return (
    <div className="grid grid-cols-4 gap-2">
      {sbtList.map(item => (
        <SbtItem key={`sbt-${item.address}-${item.tokenId}`} list={list} toggleList={toggleList} item={item} />
      ))}
    </div>
  )
}

const CardEditor = (input: CardEditorInput) => {
  const { isEditCard, handleOk, handleCancel, originalData, isCreateCard, sbtList } = input
  const [proofs, setProofs] = useState<SbtInfo[]>([])
  const [form] = Form.useForm()

  const onSubmit = () => {
    const newCard: ResumeCardData | undefined = {
      title: form.getFieldValue('title'),
      description: form.getFieldValue('description'),
      startTime: dayjs(form.getFieldValue('stime')),
      endTime: dayjs(form.getFieldValue('etime')),
      proofs,
      blockType: originalData?.blockType,
      order: originalData?.order,
    }
    handleOk(newCard)
  }

  useEffect(() => {
    form.setFieldsValue({
      title: originalData?.title,
      description: originalData?.description,
    })
  }, [originalData])

  return (
    <Modal title={isCreateCard ? 'Create new experience' : 'Edit experience'} open={isEditCard} onOk={onSubmit} onCancel={handleCancel}>
      <Form
        form={form}
        initialValues={{
          title: originalData?.title,
          stime: originalData?.startTime,
          etime: originalData?.endTime,
          description: originalData?.description,
        }}
        layout="vertical"
      >
        <Form.Item label='Experience Title (eg "ECO Partner", "Product Lead", etc.)' name="title">
          <Input placeholder="Please input your experience title" />
        </Form.Item>
        <Form.Item label="Start Time" name="stime">
          <DatePicker picker="month" />
        </Form.Item>
        <Form.Item label="End Time" name="etime">
          <DatePicker picker="month" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Available On-chain Proofs">
          <SbtSelectList sbtList={sbtList} originalList={originalData?.proofs} setProofs={setProofs} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CardEditor
