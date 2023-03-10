import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import Modal from 'antd/es/modal'
import Form from 'antd/es/form'
import Input from 'antd/es/input'
import dayjs from 'dayjs'
import DatePicker from 'antd/es/date-picker'
import Image from 'antd/es/image'
import VerifiedIcon from '@mui/icons-material/Verified'
import fallbackImage from '~/assets/images/fallbackImage'
import type { CardEditorInput, ResumeCardData, SbtInfo } from '../../types'

const { TextArea } = Input

const SbtItem = (props: { list: string[]; toggleList: (key: string) => void; item: SbtInfo }) => {
  const { list, toggleList, item } = props
  const key = `sbt-${item.address}-${item.tokenId}`
  const isInList = (str: string) => list.includes(str)

  return (
    <div
      key={key}
      className={`aspect-square border-2 max-w-112px overflow-hidden
      cursor-pointer ${isInList(key) ? 'border-#6525FF bg-gray-100' : 'border-black'}`}
      onClick={() => toggleList(key)}
    >
      <Image src={item.img} preview={false} crossOrigin='anonymous' alt={item.name} fallback={fallbackImage} className="w-full h-full object-contain object-center" />
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
      setList([])
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
  }, [originalList])

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
  const formRef = useRef(null)
  const [form] = Form.useForm()

  const checkValidateFields = async (): Promise<boolean> => {
    let valid = true
    try {
      const values = await form.validateFields();
      valid = true
    } catch (errorInfo) {
      valid = false
    }
    return valid
  };

  const onSubmit = async () => {
    const valid = await checkValidateFields()
    if (!valid) {
      return
    }
    const newCard: ResumeCardData | undefined = {
      title: form.getFieldValue('title'),
      description: form.getFieldValue('description'),
      startTime: dayjs(form.getFieldValue('stime')),
      endTime: dayjs(form.getFieldValue('etime')),
      proofs,
      blockType: originalData?.blockType,
      id: originalData?.id === undefined ? uuid() : originalData?.id,
    }
    handleOk(newCard)
  }

  // 时刻监听父组件传来的
  useEffect(() => {
    if (formRef.current) {
      form.setFieldsValue({
        title: originalData?.title,
        description: originalData?.description,
        stime: originalData?.startTime,
        etime: originalData?.endTime,
      })
    }

  }, [originalData])

  return (
    <Modal title={isCreateCard ? 'Create new experience' : 'Edit experience'} open={isEditCard} onOk={onSubmit} onCancel={handleCancel}>
      <Form
        ref={formRef}
        form={form}
        name="match"
        initialValues={{
          title: originalData?.title,
          stime: originalData?.startTime,
          etime: originalData?.endTime,
          description: originalData?.description,
        }}
        layout="vertical"
      >
        <Form.Item
          label='Experience Title (eg "ECO Partner", "Product Lead", etc.)' name="title"
          rules={[{ required: true, message: 'Please input your experience title' }]}>
          <Input placeholder="Please input your experience title" />
        </Form.Item>
        <Form.Item label="Start Time" name="stime" rules={[{ required: true, message: 'Please select start time!' }]}>
          <DatePicker picker="month" />
        </Form.Item>
        <Form.Item label="End Time" name="etime" rules={[{ required: true, message: 'Please select end time!' }]}>
          <DatePicker picker="month" />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input description' }]}>
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
