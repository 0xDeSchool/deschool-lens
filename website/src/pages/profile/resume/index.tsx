import Divider from 'antd/es/divider'
import { useEffect, useState } from 'react'
import Button from 'antd/es/button'
import message from 'antd/es/message'
import Modal from 'antd/es/modal'
import dayjs from 'dayjs'
import CopyToClipboard from 'react-copy-to-clipboard'
import { v4 as uuid } from 'uuid'
import ReactLoading from 'react-loading'
import { useParams, useSearchParams } from 'react-router-dom'
import { getIdSbt, getResume, putResume } from '~/api/booth/booth'
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

type PublishType = 'CyberConnect' | 'Lens'

const Resume = () => {
  const { address } = useParams()
  const [query] = useSearchParams()
  const user = useAccount()
  const lensProfile = user?.lensProfile()
  const ccProfile = user?.ccProfile()

  const [isEditResume, setIsEditResume] = useState(false)
  const [isCreateCard, setIsCreateCard] = useState(false)
  const [isEditCard, setIsEditCard] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData>()
  const [cardData, setCardData] = useState<ResumeCardData | undefined>()
  const [loading, setLoading] = useState(true)
  const [putting, setPutting] = useState(false)
  const [prevData, setPrev] = useState<ResumeData | undefined>()
  const [sbtList, setSbtList] = useState<SbtInfo[]>([])
  const [congratulateVisible, setCongratulateVisible] = useState<boolean>(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [PublishType, setPublishType] = useState<PublishType>('Lens')
  const [txHash, setTxHash] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const [loadingLens, setLoadingLens] = useState(false)
  const [loadingCyber, setLoadingCyber] = useState(false)
  const [visitCase, setVisitCase] = useState<VisitType>(-1) // 0-?????????????????? 1-?????????????????? -1-?????????????????????
  const ccInstance = useCyberConnect()

  // ???????????????????????????id?????????????????????
  const convertResumeCardData = (input: ResumeCardData[]) => input.map((item: ResumeCardData, index: number) => ({
    ...item,
    startTime: dayjs(item.startTime),
    endTime: dayjs(item.endTime),
    id: index,
  }))

  // ?????????????????????Obj
  const covertCareerAndEdu = (input: string) => {
    const obj = JSON.parse(input)
    // ????????????
    if (obj.career !== undefined) {
      obj.career = [...convertResumeCardData(obj.career)]
    }
    if (obj.edu !== undefined) {
      obj.edu = [...convertResumeCardData(obj.edu)]
    }
    return obj
  }

  // ??????????????????

  // ?????????????????? or ??????????????????
  const onClickEditResume = async () => {
    if (isEditResume) {
      if (user?.address) {
        setPutting(true)
        const dataStr = JSON.stringify(resumeData)
        await putResume({ data: dataStr })
        setPutting(false)
      }
    } else {
      // ????????? // no ?????????
      const prevStr = JSON.stringify(resumeData)
      const prevObj = covertCareerAndEdu(prevStr)

      setPrev(prevObj)
    }
    setIsEditResume(!isEditResume)
  }

  // ????????????????????????
  const handleCancelEditing = () => {
    setResumeData(prevData)
    setIsEditResume(!isEditResume)
  }

  // ?????? or ???????????? - ??????
  const handleEditOrCreateCardSave = async (newData: ResumeCardData) => {
    let dataIndex: number | undefined
    const bt = newData.blockType

    let newResumeData: ResumeData | undefined
    // ????????????????????????
    if (isCreateCard) {
      newResumeData = resumeData
      if (newResumeData === undefined) {
        newResumeData = { career: [], edu: [] }
      }
      // ????????????
      if (bt === BlockType.CareerBlockType) {
        if (newResumeData.career === undefined) {
          newResumeData.career = []
        }
        newResumeData.career.push(newData)
      }
      // ????????????
      else if (bt === BlockType.EduBlockType) {
        if (newResumeData.edu === undefined) {
          newResumeData.edu = []
        }
        newResumeData.edu.push(newData)
      } else {
        return
      }
    }
    // ????????????????????????
    else {
      newResumeData = resumeData
      if (newResumeData === undefined) {
        return
      }
      // ????????????
      if (bt === BlockType.CareerBlockType && newResumeData?.career !== undefined) {
        dataIndex = newResumeData?.career.findIndex(item => item.blockType === bt && item.id === newData.id)
        if (dataIndex !== -1 && dataIndex !== undefined) {
          newResumeData.career[dataIndex] = newData
        }
      }
      // ????????????
      else if (bt === BlockType.EduBlockType && newResumeData?.edu !== undefined) {
        dataIndex = newResumeData?.edu.findIndex(item => item.blockType === bt && item.id === newData.id)
        if (dataIndex !== -1 && dataIndex !== undefined) {
          newResumeData.edu[dataIndex] = newData
        }
      } else {
        return
      }
    }
    setResumeData(newResumeData)

    // CL??????????????????
    // loading && <div> ?????????????????????
    // ??????????????????????????? props ??????????????????????????????????????????????????? list
    // ??? close ??? Model ??????

    // ??????????????????
    const emptyCardData: ResumeCardData = {
      title: '',
      description: '',
      startTime: undefined,
      endTime: undefined,
      proofs: [],
      blockType: bt,
      id: newData.id,
    }
    await setCardData(emptyCardData)

    setIsCreateCard(false)
    setIsEditCard(false)
  }

  // ???????????? - ??????
  const handleEditCardCancel = () => {
    setIsCreateCard(false)
    setIsEditCard(false)
  }

  // ?????? & ??????
  // ???????????? order ?????????????????? order ?????? arr.length + 1 ?????????????????????
  // ????????????????????? order?????????????????? order ????????????????????? order??????????????? order ???????????????

  // ???????????? - ??????
  const handleDeleteCard = (bt: BlockType, id: string) => {
    const newResumeData: ResumeData = { edu: [], career: [] }
    if (bt === BlockType.CareerBlockType && resumeData?.career !== undefined) {
      newResumeData.career = resumeData?.career?.filter(item => item.id !== id)
      newResumeData.edu = resumeData?.edu
    } else if (bt === BlockType.EduBlockType && resumeData?.edu !== undefined) {
      newResumeData.edu = resumeData?.edu?.filter(item => item.id !== id)
      newResumeData.career = resumeData?.career
    }
    setResumeData(newResumeData)
  }

  // ??????????????????
  const handleEditCard = (bt: BlockType, id: string) => {
    let card: ResumeCardData | undefined

    if (bt === BlockType.CareerBlockType && resumeData?.career !== undefined) {
      card = resumeData?.career?.find(item => item.id === id)
    } else if (bt === BlockType.EduBlockType && resumeData?.edu !== undefined) {
      card = resumeData?.edu?.find(item => item.id === id)
    }
    if (!card) {
      return
    }
    setCardData(card)
    setIsEditCard(true)
  }

  // ??????????????????
  const handleCreateCard = (bt: BlockType, contractAddress?: string, tokenId?: string) => {
    const emptyCardData: ResumeCardData = {
      title: '',
      description: '',
      startTime: undefined,
      endTime: undefined,
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

  // ??????
  const handleSortCard = (bt: BlockType, list: ResumeCardData[]) => {
    if (bt === BlockType.CareerBlockType && resumeData?.career !== undefined) {
      setResumeData({ career: list, edu: resumeData.edu })
    } else if (bt === BlockType.EduBlockType && resumeData?.edu !== undefined) {
      setResumeData({ career: resumeData.career, edu: list })
    }
  }

  // ???????????????????????????
  const fetchUserResume = async (resumeAddress: string) => {
    if (!resumeAddress) {
      return message.error("fetchUserResume Error: resumeAddress can't be null")
    }
    const result = await getResume(resumeAddress)

    if (result?.data) {
      const resumeObj = covertCareerAndEdu(result.data)
      setResumeData(resumeObj)
    }
    setLoading(false)
  }

  // ????????????????????? SBT ??????
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

  // Lens ?????????????????????
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

  // Cyber ?????????????????????
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

  // ????????????????????????resume?????????
  const handlePrimaryCase = async (primaryCase: 0 | 1 | -1) => {
    let currentAddress: string | undefined | null = null
    if (primaryCase > -1) {
      // 0????????????????????????1????????????????????????????????????
      currentAddress = primaryCase === 0 ? user?.address : address
      if (currentAddress) {
        await fetchUserResume(currentAddress)
        await fetchUserSbtList(currentAddress)
      } else {
        message.warning(`handlePrimaryCase Warning: case:${primaryCase},currentAddress:${currentAddress} error`)
      }
    } else {
      console.log('handlePrimaryCase log: ?????????', primaryCase)
    }
  }

  // ???????????????????????????????????????????????????????????? SBT ??????
  useEffect(() => {
    // ???????????????????????????????????????????????????????????????????????????????????????
    const primaryCase = getVisitCase(address)
    fetchUserInfoByAddress()
    setVisitCase(primaryCase)
    handlePrimaryCase(primaryCase)
  }, [address, user])

  const { setConnectBoardVisible } = useLayout()
  // ???????????????deschool????????????????????????????????????
  useEffect(() => {
    const origin = query.get('origin')
    const contractAddress = query.get('contractAddress')
    const tokenId = query.get('tokenId')

    if (!user) {
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
    <div className="bg-white p-8">
      {/* ???????????? + ???????????? */}
      <div className="flex justify-between">
        <div className="text-2xl font-bold font-ArchivoNarrow">
          RESUME
          <span className="ml-1">
            OF <span className="ml-1 text-gray-5 font-ArchivoNarrow">{currentUser?.displayName || user?.displayName}</span>
          </span>
        </div>
        <div className="flex">
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
            text={`https://booth.ink/profile/${user?.address}/resume`}
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

      {visitCase !== -1 && loading && <ReactLoading type="bars" />}
      {visitCase !== -1 && !loading && (
        <>
          {/* ?????????????????? */}
          <ResumeBlock
            blockType={BlockType.CareerBlockType}
            dataArr={resumeData?.career || []}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            handleCreateCard={handleCreateCard}
            handleSortCard={handleSortCard}
            isEditResume={isEditResume}
          />

          {/* ?????????????????? */}
          <ResumeBlock
            blockType={BlockType.EduBlockType}
            dataArr={resumeData?.edu || []}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            handleCreateCard={handleCreateCard}
            handleSortCard={handleSortCard}
            isEditResume={isEditResume}
          />

          {/* ????????????????????? */}
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

      {/* Mint Lens NFT ?????? Model */}
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
