import Divider from 'antd/es/divider'
import { useEffect, useState } from 'react'
import Button from 'antd/es/button'
import dayjs from 'dayjs'
import ReactLoading from 'react-loading'
import { getIdSbt, getResume, putResume } from '~/api/booth/booth'
import { getAddress } from '~/auth'
import CardEditor from './components/cardEditor'
import ResumeBlock from './components/resumeBlock'
import { BlockType } from './enum'
import type { ResumeCardData, ResumeData, SbtInfo } from './types'

type ResumeProp = {
  handle?: string
}

// TODO: Replace this with real data
const TEST_RESUME_DATA: ResumeData = {
  career: [
    {
      title: 'Fullstack Engineer @DeSchool',
      description:
        'Likable cashier with over 5 years of professional experience. Seeks to utilize top-class organizational and attention to detail skills to boost efficiency at ABC Inc. At DEF Inc., awarded Employee of the Month four times in a row for accuracy and efficiency. At GHI Inc., worked a streak of 450 days with no sick leave and a 30% higher accuracy score than peers.',
      startTime: dayjs('2022-04-04T16:00:00.000Z'),
      endTime: dayjs('2022-08-04T16:00:00.000Z'),
      proofs: undefined,
      blockType: BlockType.CareerBlockType,
      order: 1,
    },
  ],
  edu: [
    {
      title: 'Web3U Series 100, 110, 200, 400, 600 from DeSchool',
      description:
        'Likable cashier with over 5 years of professional experience. Seeks to utilize top-class organizational and attention to detail skills to boost efficiency at ABC Inc. At DEF Inc., awarded Employee of the Month four times in a row for accuracy and efficiency. At GHI Inc., worked a streak of 450 days with no sick leave and a 30% higher accuracy score than peers.',
      startTime: dayjs('2022-02-04T16:00:00.000Z'),
      endTime: dayjs('2023-11-04T16:00:00.000Z'),
      proofs: undefined,
      blockType: BlockType.EduBlockType,
      order: 2,
    },
  ],
}

const Resume = (props: ResumeProp) => {
  const { handle } = props
  const [isEditResume, setIsEditResume] = useState(false)
  const [isCreateCard, setIsCreateCard] = useState(false)
  const [isEditCard, setIsEditCard] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | undefined>()
  const [cardData, setCardData] = useState<ResumeCardData | undefined>()
  const [loading, setLoading] = useState(false)
  const [notLogin, setNotLogin] = useState(false)
  const [putting, setPutting] = useState(false)
  const [prevData, setPrev] = useState<ResumeData | undefined>()
  const [sbtList, setSbtList] = useState<SbtInfo[]>([])

  // 把一条变成 Dayjs Obj
  const convertStrToDayJsObj = (input: ResumeCardData) => {
    input.startTime = dayjs(input.startTime)
    input.endTime = dayjs(input.endTime)
    return input
  }

  // 重新把数据变成Obj
  const covertCareerAndEdu = (input: string) => {
    const obj = JSON.parse(input)
    // 转换格式
    if (obj.career !== undefined) {
      obj.career = [...obj.career.map((item: ResumeCardData) => convertStrToDayJsObj(item))]
    }
    if (obj.edu !== undefined) {
      obj.edu = [...obj.edu.map((item: ResumeCardData) => convertStrToDayJsObj(item))]
    }
    return obj
  }

  // 提交用户简历
  const putUserResume = async (data: string, address: string) => {
    await putResume({ address, data })
  }

  // 进入简历编辑 or 保存查看状态
  const onClickEditResume = async () => {
    if (isEditResume) {
      const address = getAddress()
      if (address !== null) {
        await setPutting(true)
        await putUserResume(JSON.stringify(resumeData), address)
        await setPutting(false)
      }
    } else {
      await setPrev(resumeData)
    }
    setIsEditResume(!isEditResume)
  }

  // 取消编辑整个简历
  const handleCancelEditing = () => {
    setResumeData(prevData)
    setIsEditResume(!isEditResume)
  }

  // 创造 or 编辑经历 - 保存
  const handleEditOrCreateCardSave = async (newData: ResumeCardData) => {
    let dataIndex: number | undefined
    const bt = newData.blockType
    const { order } = newData

    let newResumeData: ResumeData | undefined
    // 场景一：创造卡片
    if (isCreateCard) {
      newResumeData = resumeData
      if (newResumeData === undefined) {
        newResumeData = { career: [], edu: [] }
      }
      // 职业类型
      if (bt === BlockType.CareerBlockType) {
        if (newResumeData.career === undefined) {
          newResumeData.career = []
        }
        newResumeData.career.push(newData)
      }
      // 教育类型
      else if (bt === BlockType.EduBlockType) {
        if (newResumeData.edu === undefined) {
          newResumeData.edu = []
        }
        newResumeData.edu.push(newData)
      } else {
        return
      }
    }
    // 场景二：编辑卡片
    else {
      newResumeData = resumeData
      if (newResumeData === undefined) {
        return
      }
      // 职业类型
      if (bt === BlockType.CareerBlockType && newResumeData?.career !== undefined) {
        dataIndex = newResumeData?.career.findIndex(item => item.blockType === bt && item.order === order)
        if (dataIndex !== -1 && dataIndex !== undefined) {
          newResumeData.career[dataIndex] = newData
        }
      }
      // 教育类型
      else if (bt === BlockType.EduBlockType && newResumeData?.edu !== undefined) {
        dataIndex = newResumeData?.edu.findIndex(item => item.blockType === bt && item.order === order)
        if (dataIndex !== -1 && dataIndex !== undefined) {
          newResumeData.edu[dataIndex] = newData
        }
      } else {
        return
      }
    }
    setResumeData(newResumeData)
    setIsCreateCard(false)
    setIsEditCard(false)
  }

  // 编辑经历 - 放弃
  const handleEditCardCancel = () => {
    setIsCreateCard(false)
    setIsEditCard(false)
  }

  // 删除经历 - 确认
  const handleDeleteCard = (bt: BlockType, order: number) => {
    let prevArr: ResumeCardData[] | undefined
    const newArr: ResumeCardData[] | undefined = []
    const newResumeData: ResumeData | undefined = { edu: [], career: [] }
    if (bt === BlockType.CareerBlockType) {
      prevArr = resumeData?.career
    } else if (bt === BlockType.EduBlockType) {
      prevArr = resumeData?.edu
    } else {
      return
    }
    if (prevArr === undefined || resumeData === undefined) {
      return
    }

    for (let i = 0; i < order - 1; i++) {
      newArr[i] = prevArr[i]
    }
    for (let i = order - 1; i < prevArr.length - 2; i++) {
      newArr[i] = prevArr[i + 1]
    }
    if (bt === BlockType.CareerBlockType) {
      newResumeData.edu = resumeData?.edu
      newResumeData.career = newArr
    } else if (bt === BlockType.EduBlockType) {
      newResumeData.edu = newArr
      newResumeData.career = resumeData?.career
    } else {
      return
    }
    setResumeData(newResumeData)
  }

  // 开始编辑卡片
  const handleEditCard = (bt: BlockType, order: number) => {
    let card: ResumeCardData | undefined
    let arr: ResumeCardData[] | undefined
    if (bt === BlockType.CareerBlockType && resumeData?.career !== undefined) {
      arr = resumeData?.career.filter(item => item.blockType === bt && item.order === order)
    } else if (bt === BlockType.EduBlockType && resumeData?.edu !== undefined) {
      arr = resumeData?.edu.filter(item => item.blockType === bt && item.order === order)
    } else {
      return
    }
    if (arr?.length === 1) {
      // TO-ASK 这里为啥会有一个分号
      ;[card] = arr
    } else {
      return
    }
    setCardData(card)
    setIsEditCard(true)
  }

  // 开始创建卡片
  const handleCreateCard = (bt: BlockType, order: number) => {
    const emptyCardData: ResumeCardData = {
      title: '',
      description: '',
      startTime: undefined,
      endTime: undefined,
      proofs: undefined,
      blockType: bt,
      order,
    }
    setCardData(emptyCardData)
    setIsCreateCard(true)
    setIsEditCard(true)
  }

  // 获取当前用户的简历
  const fetchUserResume = async () => {
    const address = getAddress()
    if (address === null) {
      setNotLogin(true)
      return
    }
    const result = await getResume(address)

    if (!result) {
      // TODO: 写一份标准简历，更改变量名字
      setResumeData(TEST_RESUME_DATA)
      await putUserResume(JSON.stringify(TEST_RESUME_DATA), address)
      return
    }
    const resumeObj = covertCareerAndEdu(result.data)
    setResumeData(resumeObj)
    setLoading(false)
  }

  // 获取当前用户的 SBT 列表
  const fetchUserSbtList = async () => {
    const address = getAddress()
    if (address === null) {
      return
    }
    const result = await getIdSbt(address)
    if (result === undefined || !result.sbts) {
      return
    }
    const sbtArr: SbtInfo[] = []
    for (let i = 0; i < result.sbts.length; i++) {
      const sbt = result.sbts[i]
      const url = sbt.normalized_metadata.image
      const re = 'ipfs://'
      const newUrl = url.replace(re, 'http://ipfs.io/ipfs/')
      sbtArr.push({
        address: sbt.token_address,
        tokenId: sbt.token_id,
        img: newUrl,
      })
    }
    setSbtList(sbtArr)
  }

  // 初始时，加载用户简历，并调用查询用户可选 SBT 列表
  useEffect(() => {
    fetchUserResume()
    fetchUserSbtList()
  }, [])

  return (
    <div className="bg-white p-8">
      {/* 简历标题 + 编辑按钮 */}
      <div className="flex justify-between">
        <div className="text-2xl font-bold">RESUME {handle && `OF ${handle}`}</div>
        <div className="flex">
          {!isEditResume && (
            <Button type="primary" disabled>
              {' '}
              Publish On Lens{' '}
            </Button>
          )}
          <div className="w-2"> </div>
          <Button onClick={onClickEditResume} loading={putting} type={isEditResume ? 'primary' : 'default'}>
            {' '}
            {isEditResume ? 'Save' : 'Edit'}{' '}
          </Button>
          <div className="w-2"> </div>

          {isEditResume && (
            <Button danger onClick={handleCancelEditing}>
              {' '}
              Cancel{' '}
            </Button>
          )}
        </div>
      </div>
      <Divider />

      {!notLogin && loading && <ReactLoading type="bars" />}
      {!notLogin && !loading && (
        <>
          {/* 职业板块数据 */}
          <ResumeBlock
            blockType={BlockType.CareerBlockType}
            dataArr={resumeData?.career}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            handleCreateCard={handleCreateCard}
            isEditResume={isEditResume}
          />

          {/* 教育板块数据 */}
          <ResumeBlock
            blockType={BlockType.EduBlockType}
            dataArr={resumeData?.edu}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            isEditResume={isEditResume}
            handleCreateCard={handleCreateCard}
          />

          {/* 一段经历编辑器 */}
          <CardEditor
            isEditCard={isEditCard}
            handleOk={handleEditOrCreateCardSave}
            handleCancel={handleEditCardCancel}
            originalData={cardData}
            isCreateCard={isCreateCard}
            sbtList={sbtList}
          />
        </>
      )}
      {notLogin && <div>You haven't log in yet. Please log in first</div>}
    </div>
  )
}

export default Resume
