import Divider from 'antd/es/divider'
import { useEffect, useState } from 'react'
import Button from 'antd/es/button'
import Alert from 'antd/es/alert'
import message from 'antd/es/message'
import dayjs from 'dayjs'
import ReactLoading from 'react-loading'
import Modal from 'antd/es/modal'
// import { useParams } from 'react-router'
import { useLocation } from 'react-router-dom'
import { getIdSbt, getResume, putResume } from '~/api/booth/booth'
import { useAccount } from '~/context/account'
import { createPost, getPublicationsRequest, pollAndIndexPost } from '~/api/lens/publication/post'
import { getShortAddress } from '~/utils/format'
import { PublicationTypes } from '~/api/lens/graphql/generated'
import CardEditor from './components/cardEditor'
import ResumeBlock from './components/resumeBlock'
import { BlockType } from './enum'
import type { ResumeCardData, ResumeData, SbtInfo } from './types'
import { randomConfetti } from './utils/confetti'

const BOOTH_PATH = import.meta.env.VITE_APP_BOOTH_PATH

// type ResumeProp = {
//   handle?: string
// }

export const STANDARD_RESUME_DATA: ResumeData = {
  career: [
    {
      title: 'Product Experiencer & Co-builder - Booth',
      description:
        "I experienced Booth's novel product, which is the LinkedIn of the Web3 world, which can provide people with authentic and credible work and education experience SBT as resume proof. Through Booth, we link to better and more real Web3 workers. I have fully experienced this product and made valuable suggestions",
      startTime: dayjs('2023-02-04T16:00:00.000Z'),
      endTime: dayjs('2023-02-04T16:00:00.000Z'),
      proofs: [
        {
          address: '0xEd1e617b9485168EEB25c6d56e1219747cE62D0e',
          tokenId: '0',
          img: 'https://www.ensoul.io/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fensoul-labs-image%2FgdzbhdBooth-logos.jpeg&w=256&q=75',
        },
      ],
      blockType: BlockType.CareerBlockType,
      order: 1,
    },
  ],
  edu: [
    {
      title: 'Education Cert from Booth & DeSchool',
      description:
        'I learned the knowledge of Web3 products, and successfully logged into the Booth product by linking Metamask and lens. This is an important educational experience for me. I learned the basic usage of Web3 products, so I have a credible skill certification when I look for a Web3 job or communicate with people in DAO in the future.',
      startTime: dayjs('2022-02-04T16:00:00.000Z'),
      endTime: dayjs('2023-02-04T16:00:00.000Z'),
      proofs: [
        {
          address: '0xEd1e617b9485168EEB25c6d56e1219747cE62D0e',
          tokenId: '1',
          img: 'https://www.ensoul.io/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fensoul-labs-image%2FfjvfqfBooth-logos.jpeg&w=256&q=75',
        },
      ],
      blockType: BlockType.EduBlockType,
      order: 1,
    },
  ],
}

const Resume = () => {
  // const { handle } = props
  // const { routeAddress } = useParams()
  const location = useLocation()
  const { lensProfile, lensToken, deschoolProfile } = useAccount()

  const [isEditResume, setIsEditResume] = useState(false)
  const [isCreateCard, setIsCreateCard] = useState(false)
  const [isEditCard, setIsEditCard] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | undefined>()
  const [cardData, setCardData] = useState<ResumeCardData | undefined>()
  const [loading, setLoading] = useState(true)
  const [notLogin, setNotLogin] = useState(false)
  const [putting, setPutting] = useState(false)
  const [prevData, setPrev] = useState<ResumeData | undefined>()
  const [sbtList, setSbtList] = useState<SbtInfo[]>([])
  const [congratulateVisible, setCongratulateVisible] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [txHash, setTxHash] = useState<string>('')
  const [userAddr, setUserAddr] = useState<string>('')
  const [isSelf, setIsSelf] = useState(false)

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
      const address = lensToken?.address || deschoolProfile?.address
      if (address) {
        setPutting(true)
        await putUserResume(JSON.stringify(resumeData), address)
        setPutting(false)
      }
    } else {
      // 深拷贝
      const prevStr = JSON.stringify(resumeData)
      const prevObj = covertCareerAndEdu(prevStr)
      setPrev(prevObj)
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

    // CL同学学会了：
    // loading && <div> 这样是真实销毁
    // 如果真实销毁了，传 props 自组建不会显现，所以此处必须先清空 list
    // 再 close 掉 Model 弹窗

    // 清空卡片信息
    const emptyCardData: ResumeCardData = {
      title: '',
      description: '',
      startTime: undefined,
      endTime: undefined,
      proofs: [],
      blockType: bt,
      order,
    }
    await setCardData(emptyCardData)

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

    // 写麻了，用 index 来算吧
    const theIndex = order - 1
    for (let i = 0; i <= theIndex - 1; i++) {
      newArr[i] = prevArr[i]
    }
    for (let i = theIndex; i < prevArr.length - 1; i++) {
      newArr[i] = prevArr[i + 1]
      const temp = newArr[i].order
      if (newArr[i] && temp !== undefined) {
        newArr[i].order = temp - 1
      }
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
    let address = lensToken?.address
    // 如果 lens 有简历，就优先用
    if (!address) {
      const dscAddress = deschoolProfile?.address
      if (!dscAddress) {
        setNotLogin(true)
        return
      }
      address = dscAddress
    }
    if (!address) {
      setNotLogin(true)
      return
    }
    const result = await getResume(address)

    if (!result) {
      setResumeData(STANDARD_RESUME_DATA)
      await putUserResume(JSON.stringify(STANDARD_RESUME_DATA), address)
      return
    }
    const resumeObj = covertCareerAndEdu(result.data)
    setResumeData(resumeObj)
    setLoading(false)
  }

  // 获取当前用户的 SBT 列表
  const fetchUserSbtList = async () => {
    const address = lensToken?.address || deschoolProfile?.address
    if (!address) {
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

  // 发布个人简历
  const handlePublish = async () => {
    try {
      const address = lensToken?.address || deschoolProfile?.address
      const resumeDataStr = JSON.stringify(resumeData)
      // const resumeDataStr = JSON.stringify(STANDARD_RESUME_DATA)
      if (lensProfile?.id && address && resumeDataStr) {
        const txhash = await createPost(lensProfile.id, address, resumeDataStr)
        if (txhash) {
          setStep(1)
          setTxHash(txhash)
          setCongratulateVisible(true)
          await pollAndIndexPost(txhash, lensProfile.id)
          setStep(2)
          randomConfetti()
        }
      } else {
        message.error('PUBLICATION ERROR: Please get a lens handle first')
      }
    } catch (error) {
      message.error('PUBLICATION ERROR: Publish Failed')
      console.log('error', error)
    } finally {
      // setCongratulateVisible(false)
      // setStep(1)
      // setTxHash('')
    }
  }

  // 初始时，加载用户简历，并调用查询用户可选 SBT 列表
  useEffect(() => {
    fetchUserResume()
    fetchUserSbtList()
    const addr = lensToken?.address || deschoolProfile?.address
    if (addr) {
      setUserAddr(addr)
      if (location.pathname === '/profile/resume') {
        setIsSelf(true)
      }
    }

    // TO-TEST 初始测试用户有哪些 Publications
    const getPublications = async () => {
      const profileId = lensProfile?.id
      if (!profileId) {
        throw new Error('Must define PROFILE_ID in the .env to run this')
      }

      const result = await getPublicationsRequest({
        profileId,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Comment, PublicationTypes.Mirror],
      })
      console.log('publications: result', result.items)

      return result
    }
    getPublications()
  }, [])

  return (
    <div className="bg-white p-8">
      {/* 简历标题 + 编辑按钮 */}
      <div className="flex justify-between">
        <div className="text-2xl font-bold font-ArchivoNarrow">
          RESUME
          {lensProfile?.handle && (
            <span className="ml-1">
              OF <span className="ml-1 text-gray-5">{lensProfile ? `@${lensProfile.handle}` : ''}</span>
            </span>
          )}
          {!lensProfile?.handle && userAddr && (
            <span className="ml-1">
              OF <span className="ml-1 text-gray-5">{getShortAddress(userAddr).toUpperCase()}</span>
            </span>
          )}
        </div>
        <div className="flex">
          {isSelf && !isEditResume && (
            <Button type="primary" onClick={() => handlePublish()} disabled={!lensProfile} className="bg-#abfe2c! text-black!">
              {resumeData && step === 2 ? 'Published' : 'Publish On Lens'}
            </Button>
          )}

          <div className="w-2"> </div>
          {isSelf && (
            <Button onClick={onClickEditResume} loading={putting} type={isEditResume ? 'primary' : 'default'}>
              {isEditResume ? 'Save on DeSchool' : 'Edit'}
            </Button>
          )}

          <div className="w-2"> </div>

          {isEditResume && (
            <Button danger onClick={handleCancelEditing}>
              Cancel
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

      {/* Mint Lens NFT 后的 Model */}
      <Modal
        open={congratulateVisible}
        footer={false}
        closable
        onCancel={() => {
          setCongratulateVisible(false)
        }}
      >
        {step === 1 ? (
          <div className="w-full">
            <h1 className="text-2xl font-Anton">Wait transaction to be minted ...</h1>
            <p className="mt-6">
              Your tx carries your resume has been sent to polygon network! It should be minted in a short while, you can also check tx
              status in link:
              <a href="https://stg-deschool-booth.netlify.com?inviter=0x31829814179283719" className="block underline">
                https://polygonscan.com/tx/{txHash}
              </a>
            </p>
          </div>
        ) : (
          <div className="w-full">
            <h1 className="text-2xl font-Anton">Congradulations! 🎉</h1>
            <p className="font-ArchivoNarrow mt-6">
              Your first web3 resume is published! Hooray! Thanks for using Booth to create your resume in a web3-enabled way! We hope this
              decentralized approach will help you stand out in your job search :)
            </p>
            <p className="font-ArchivoNarrow">Now you can: </p>
            <ol>
              <li className="font-ArchivoNarrow mt-1">
                1. Check{' '}
                <a href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer" className="color-#774FF8">
                  PolygonScan
                </a>{' '}
                to check transaction
              </li>
              <li className="font-ArchivoNarrow mt-1">
                2. Visit{' '}
                <a href={`https://lenster.xyz/u/${lensProfile?.handle}`} target="_blank" rel="noreferrer" className="color-#774FF8">
                  Lenster
                </a>{' '}
                to view your resume, it should update in your feeds as a post in 10 seconds.{' '}
              </li>
              <li className="font-ArchivoNarrow mt-1">
                3. Send your resume to someone (for work or just show off!) and invite more friends to this cool website with your unique
                rerferral link:
                <Alert
                  className="mt-1!"
                  message={
                    <div className="font-ArchivoNarrow ">{`${BOOTH_PATH}?inviter=${lensToken?.address || deschoolProfile?.address}`}</div>
                  }
                  type="info"
                />
              </li>
            </ol>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Resume
