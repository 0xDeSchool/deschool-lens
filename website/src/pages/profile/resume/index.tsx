import Divider from 'antd/es/divider'
import { useEffect, useMemo, useState } from 'react'
import Button from 'antd/es/button'
import message from 'antd/es/message'
import Modal from 'antd/es/modal'
import dayjs from 'dayjs'
import CopyToClipboard from 'react-copy-to-clipboard'
import { v4 as uuid } from 'uuid'
import ReactLoading from 'react-loading'
import { useParams, useSearchParams } from 'react-router-dom'
import { getIdSbt, putResume } from '~/api/booth/booth'
import { createPost, pollAndIndexPost } from '~/api/lens/publication/post'
import { getShortAddress } from '~/utils/format'
import useCyberConnect from '~/hooks/useCyberConnect'
import { useAccount } from '~/account'
import { getUserInfo } from '~/api/booth'
import type { UserInfo } from '~/api/booth/types'
import { ShareAltOutlined } from '@ant-design/icons'
import { ipfsUrl } from '~/utils/ipfs'
import { useLayout } from '~/context/layout'
import CardEditor from './components/cardEditor'
import ResumeBlock from './components/resumeBlock'
import { BlockType } from './enum'
import type { ResumeCardData, ResumeData, SbtInfo } from './types'
import { randomConfetti } from './utils/confetti'
import type { VisitType } from '../utils/visitCase';
import { getVisitCase } from '../utils/visitCase'
import Congradulations from './components/congradulations'
import { isMobile } from '~/utils/ua'
import { useProfileResume } from '~/context/profile'

type PublishType = 'CyberConnect' | 'Lens'

const Resume = () => {
  const { address } = useParams() // userId，如果有 userId，说明是来自名片的访问
  const [query] = useSearchParams()
  const user = useAccount()
  const lensProfile = user?.lensProfile()
  const ccProfile = user?.ccProfile()

  const [isEditResume, setIsEditResume] = useState(false)
  const [isCreateCard, setIsCreateCard] = useState(false)
  const [isEditCard, setIsEditCard] = useState(false)
  const [resumeLocalData, setResumeLocalData] = useState<ResumeData>()
  const [cardData, setCardData] = useState<ResumeCardData | undefined>()
  const [putting, setPutting] = useState(false)
  const [sbtList, setSbtList] = useState<SbtInfo[]>([])
  const [congratulateVisible, setCongratulateVisible] = useState<boolean>(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [PublishType, setPublishType] = useState<PublishType>('Lens')
  const [txHash, setTxHash] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const [loadingLens, setLoadingLens] = useState(false)
  const [loadingCyber, setLoadingCyber] = useState(false)
  const [visitCase, setVisitCase] = useState<VisitType>(-1) // 0-自己访问自己 1-自己访问别人 -1-没登录访问自己
  const ccInstance = useCyberConnect()
  const mobile = isMobile()
  const { resumeData, loadingResume, refreshUserResume } = useProfileResume()

  const resumeDataMemo = useMemo(() => {
    return isEditResume ? resumeLocalData : resumeData
  }, [resumeData, resumeLocalData, isEditResume, loadingResume])

  // 组装简历数据，添加id，转换时间格式
  const convertResumeCardData = (input: ResumeCardData[]) => input.map((item: ResumeCardData, index: number) => ({
    ...item,
    startTime: dayjs(item.startTime),
    endTime: dayjs(item.endTime),
    id: index,
  }))

  // 重新把数据变成Obj
  const covertCareerAndEdu = (input: string) => {
    const obj = JSON.parse(input)
    // 转换格式
    if (obj.career !== undefined) {
      obj.career = [...convertResumeCardData(obj.career)]
    }
    if (obj.edu !== undefined) {
      obj.edu = [...convertResumeCardData(obj.edu)]
    }
    return obj
  }

  // 取消编辑整个简历
  const handleCancelEditing = () => {
    setResumeLocalData(resumeData)
    setIsEditResume(!isEditResume)
  }

  // 创造 or 编辑经历 - 保存
  const handleEditOrCreateCardSave = async (newData: ResumeCardData) => {
    let dataIndex: number | undefined
    const bt = newData.blockType
    let newResumeData: ResumeData | undefined
    // 场景一：创造卡片
    if (isCreateCard) {
      newResumeData = resumeLocalData
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
      newResumeData = resumeLocalData
      if (newResumeData === undefined) {
        return
      }
      // 职业类型
      if (bt === BlockType.CareerBlockType && newResumeData?.career !== undefined) {
        dataIndex = newResumeData?.career.findIndex(item => item.blockType === bt && item.id === newData.id)
        if (dataIndex !== -1 && dataIndex !== undefined) {
          newResumeData.career[dataIndex] = newData
        }
      }
      // 教育类型
      else if (bt === BlockType.EduBlockType && newResumeData?.edu !== undefined) {
        dataIndex = newResumeData?.edu.findIndex(item => item.blockType === bt && item.id === newData.id)
        if (dataIndex !== -1 && dataIndex !== undefined) {
          newResumeData.edu[dataIndex] = newData
        }
      } else {
        return
      }
    }
    setResumeLocalData(newResumeData)

    // CL同学学会了：
    // loading && <div> 这样是真实销毁
    // 如果真实销毁了，传 props 自组建不会显现，所以此处必须先清空 list
    // 再 close 掉 Model 弹窗

    // 清空卡片信息
    const emptyCardData: ResumeCardData = {
      title: '',
      project: null,
      role: '',
      description: '',
      startTime: undefined,
      endTime: undefined,
      isPresent: false,
      proofs: [],
      blockType: bt,
      id: newData.id,
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

  // 编辑 & 删除
  // 不能通过 order 来判断，因为 order 是从 arr.length + 1 计算从而得到的
  // 如果删除了某个 order，那么后面的 order 就会变成前面的 order，可能会有 order 重复的情况

  // 删除经历 - 确认
  const handleDeleteCard = (bt: BlockType, id: string) => {
    const newResumeData: ResumeData = { edu: [], career: [] }
    if (bt === BlockType.CareerBlockType && resumeLocalData?.career !== undefined) {
      newResumeData.career = resumeLocalData?.career?.filter(item => item.id !== id)
      newResumeData.edu = resumeLocalData?.edu
    } else if (bt === BlockType.EduBlockType && resumeLocalData?.edu !== undefined) {
      newResumeData.edu = resumeLocalData?.edu?.filter(item => item.id !== id)
      newResumeData.career = resumeLocalData?.career
    }
    setResumeLocalData(newResumeData)
  }

  // 开始编辑卡片
  const handleEditCard = (bt: BlockType, id: string) => {
    let card: ResumeCardData | undefined

    if (bt === BlockType.CareerBlockType && resumeLocalData?.career !== undefined) {
      card = resumeLocalData?.career?.find(item => item.id === id)
    } else if (bt === BlockType.EduBlockType && resumeLocalData?.edu !== undefined) {
      card = resumeLocalData?.edu?.find(item => item.id === id)
    }
    if (!card) {
      return
    }
    setCardData(card)
    setIsEditCard(true)
  }

  // 开始创建卡片
  const handleCreateCard = (bt: BlockType, contractAddress?: string, tokenId?: string) => {
    const emptyCardData: ResumeCardData = {
      title: '',
      description: '',
      project: null,
      role: '',
      startTime: undefined,
      endTime: undefined,
      isPresent: false,
      proofs: contractAddress && tokenId ? [{
        address: contractAddress,
        tokenId, img: '',
      }] : undefined,
      blockType: bt,
      id: uuid(),
    }
    setCardData(emptyCardData)
    setIsCreateCard(true)
    setIsEditCard(true)
  }

  // 排序
  const handleSortCard = (bt: BlockType, list: ResumeCardData[]) => {
    if (bt === BlockType.CareerBlockType && resumeLocalData?.career !== undefined) {
      setResumeLocalData({ career: list, edu: resumeLocalData.edu })
    } else if (bt === BlockType.EduBlockType && resumeLocalData?.edu !== undefined) {
      setResumeLocalData({ career: resumeLocalData.career, edu: list })
    }
  }

  // 获取当前用户的 SBT 列表
  const fetchUserSbtList = async (resumeAddress: string) => {
    if (!resumeAddress) {
      return message.error("fetchUserSbtList Error: resumeAddress can't be null")
    }
    const result = await getIdSbt(resumeAddress)
    if (result === undefined || !result.sbts) {
      return
    }
    const sbtArr: SbtInfo[] = []
    for (let i = 0; i < result.sbts.length; i++) {
      const sbt = result.sbts[i]
      const url = sbt.normalized_metadata.image
      const newUrl = ipfsUrl(url)
      sbtArr.push({
        address: sbt.token_address,
        tokenId: sbt.token_id,
        img: newUrl,
        name: sbt.normalized_metadata.name,
        description: sbt.normalized_metadata.description,
      })
    }
    setSbtList(sbtArr)
  }

  // 进入简历编辑 or 保存查看状态
  const onClickEditResume = async () => {
    if (isEditResume) {
      if (user?.address) {
        setPutting(true)
        const dataStr = JSON.stringify(resumeLocalData)
        await putResume({ data: dataStr })
        setPutting(false)
        refreshUserResume(user?.address)
      }
    } else {
      // 深拷贝 // no 浅拷贝
      const prevStr = JSON.stringify(resumeData)
      const prevObj = covertCareerAndEdu(prevStr)
      setResumeLocalData(prevObj)
    }
    setIsEditResume(!isEditResume)
  }

  // Lens 上发布个人简历
  const handlePublish = async () => {
    try {
      setLoadingLens(true)
      const resumeDataStr = JSON.stringify(resumeData)
      const lensProfileId = lensProfile?.data?.id
      if (lensProfileId && user?.address && resumeDataStr) {
        const txhash = await createPost(lensProfileId, user?.address, resumeDataStr)
        if (txhash) {
          setPublishType('Lens')
          setStep(1)
          setTxHash(txhash)
          setCongratulateVisible(true)
          await pollAndIndexPost(txhash, lensProfileId)
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
      setLoadingLens(false)
    }
  }

  // Cyber 上发布个人简历
  const handlePublishCyberConnect = async () => {
    try {
      setLoadingCyber(true)
      const resumeDataStr = JSON.stringify(resumeData)
      if (ccProfile?.handle && user?.address && resumeDataStr) {
        const result = await ccInstance.createPost({
          title: `RESUME OF${user?.address}`,
          body: resumeDataStr,
          author: ccProfile?.handle,
        })
        const txhash = result?.arweaveTxHash
        if (txhash) {
          setPublishType('CyberConnect')
          setStep(1)
          setTxHash(txhash)
          setCongratulateVisible(true)
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
      setLoadingCyber(false)
    }
  }

  const fetchUserInfoByAddress = async () => {
    if (!address) {
      setCurrentUser(null)
      return
    }
    const result = await getUserInfo(address)
    if (result?.displayName === address) {
      result.displayName = getShortAddress(address)
    }
    setCurrentUser(result)
  }

  // 处理不同场景下的resume初始化
  const handlePrimaryCase = async (primaryCase: 0 | 1 | -1) => {
    let currentAddress: string | undefined | null = null
    if (primaryCase > -1) {
      // 0访问自己的地址，1访问他人地址（从路由拿）
      currentAddress = primaryCase === 0 ? user?.address : address
      if (currentAddress) {
        await refreshUserResume(currentAddress)
        await fetchUserSbtList(currentAddress)
      } else {
        message.warning(`handlePrimaryCase Warning: case:${primaryCase},currentAddress:${currentAddress} error`)
      }
    } else {
      console.log('handlePrimaryCase log: 未登录', primaryCase)
    }
  }

  // 初始时，加载用户简历，并调用查询用户可选 SBT 列表
  useEffect(() => {
    // 初始化登录场景，区分自己访问自己或自己访问别人或者别人访问
    const primaryCase = getVisitCase(address)
    fetchUserInfoByAddress()
    setVisitCase(primaryCase)
    handlePrimaryCase(primaryCase)
  }, [address, user])

  const { setConnectBoardVisible } = useLayout()
  // 判断是否从deschool跳转来，并执行一系列操作
  useEffect(() => {
    const origin = query.get('origin')
    const contractAddress = query.get('contractAddress')
    const tokenId = query.get('tokenId')

    if (!user && origin && origin === 'deschoolFeedback') {
      setConnectBoardVisible(true)
      return
    }
    if (origin && origin === 'deschoolFeedback' && contractAddress && tokenId) {
      setConnectBoardVisible(false)
      setIsEditResume(true)
      handleCreateCard(BlockType.EduBlockType, contractAddress, tokenId)
    }
  }, [query, user])

  return (
    <div className="p-8 bg-#FFFFFF" style={{ boxShadow: 'inset 0px 0px 20px rgba(119, 79, 248, 0.1)' }}>
      {/* 简历标题 + 编辑按钮 */}
      <div className="flex justify-between">
        <div className="text-2xl font-bold font-ArchivoNarrow">
          RESUME
          <span className="ml-1">
            OF <span className="ml-1 text-gray-5 font-ArchivoNarrow">{currentUser?.displayName || user?.displayName}</span>
          </span>
        </div>
        {/* mobile not allow edit */}
        <div className={mobile ? 'hidden' : 'flex'}>
          {visitCase === 0 && !isEditResume && (
            <>
              {user?.lensProfile() && <Button
                type="primary"
                onClick={() => handlePublish()}
                disabled={!lensProfile}
                loading={loadingLens}
                className="bg-#abfe2c! text-black! mr-2 font-ArchivoNarrow"
              >
                {resumeData && step === 2 ? 'Published' : 'Publish On Lens'}
              </Button>}
              {user?.ccProfile() && <Button
                type="primary"
                onClick={() => handlePublishCyberConnect()}
                disabled={!ccProfile}
                loading={loadingCyber}
                className="bg-black! text-white! font-ArchivoNarrow"
              >
                {resumeData && step === 2 ? 'Published' : 'Publish On CC'}
              </Button>}
            </>
          )}

          <div className="w-2"> </div>
          {visitCase === 0 && (
            <Button onClick={onClickEditResume} loading={putting} type={isEditResume ? 'primary' : 'default'} className="font-ArchivoNarrow">
              {isEditResume ? 'Save on DeSchool' : 'Edit'}
            </Button>
          )}

          <div className="w-2"> </div>

          {isEditResume && (
            <Button danger onClick={handleCancelEditing} className="mr-2">
              Cancel
            </Button>
          )}
          {visitCase === 0 && <CopyToClipboard
            text={`${location.origin}/profile/${user?.address}/resume/${user?.id}`}
            onCopy={() => {
              message.success('Copied')
            }}
          >
            <Button
              className="frc-center font-ArchivoNarrow whitespace-nowrap"
              shape='circle'
              icon={<ShareAltOutlined />}
            />
          </CopyToClipboard>}
        </div>
      </div>
      <Divider />

      {visitCase !== -1 && loadingResume && <ReactLoading type="bars" />}
      {visitCase !== -1 && !loadingResume && (
        <>
          {/* 职业板块数据 */}
          <ResumeBlock
            blockType={BlockType.CareerBlockType}
            dataArr={resumeDataMemo?.career || []}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            handleCreateCard={handleCreateCard}
            handleSortCard={handleSortCard}
            isEditResume={isEditResume}
          />

          {/* 教育板块数据 */}
          <ResumeBlock
            blockType={BlockType.EduBlockType}
            dataArr={resumeDataMemo?.edu || []}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            handleCreateCard={handleCreateCard}
            handleSortCard={handleSortCard}
            isEditResume={isEditResume}
          />

          <div className='frc-center font-ArchivoNarrow-Medium text-16px text-#18181865 mt-16px'>Supported by <a href='https://deschool.app/' target="_blank" className='ml-4px text-#6525FF'>DeSchool</a></div>

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

      {visitCase === -1 && <div>You haven't log in yet. Please log in first</div>}

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
          <Congradulations txHash={txHash} type={PublishType} />
        )}
      </Modal>
    </div>
  )
}

export default Resume
