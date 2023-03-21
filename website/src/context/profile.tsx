/* eslint-disable class-methods-use-this */
import message from 'antd/es/message'
import dayjs from 'dayjs'
import { Dispatch, ReactElement, SetStateAction, useState } from 'react'
import { useMemo, useEffect, useContext, createContext } from 'react'
import { useParams } from 'react-router'
import { useAccount } from '~/account'
import { getLatestUsers, getUserInfo } from '~/api/booth'
import { getResume } from '~/api/booth/booth'
import { ResumeProject, UserInfo } from '~/api/booth/types'
import { ResumeCardData, ResumeData } from '~/pages/profile/resume/types'
import { getShortAddress } from '~/utils/format'

type ProfileContextProps = {
  user: UserInfo | null
  followers: number
  followings: number
  project: ResumeProject | null
  role: string | null
  resumeData: any
  // setUser: Dispatch<SetStateAction<UserInfo | null>>
  // setFollowers: Dispatch<SetStateAction<number>>
  // setFollowings: Dispatch<SetStateAction<number>>
  // setProject: Dispatch<SetStateAction<ResumeProject | null>>
  // setRole: Dispatch<SetStateAction<string | null>>
  // setResumeData: Dispatch<SetStateAction<any>>
}

export const ProfileContext = createContext<ProfileContextProps>({
  user: null,
  followers: 0,
  followings: 0,
  project: null,
  role: null,
  resumeData: null,
  // setUser: () => {},
  // setFollowers: () => {},
  // setFollowings: () => {},
  // setProject: () => {},
  // setRole: () => {},
  // setResumeData: () => {},
})

export const ProfileContextProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [followers, setFollowers] = useState<number>(0)
  const [followings, setFollowings] = useState<number>(0)
  const [project, setProject] = useState<ResumeProject | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<any>(null)
  const {address } = useParams()
  const account = useAccount()

  const profileMemo = useMemo(() => {
    return {
      user,
      followers,
      followings,
      project,
      role,
      resumeData,
    }
  }, [user, followers, followings, project, role, resumeData])

  const fetchUserInfoByAddress = async (resumeAddress: string) => {
    const result = await getUserInfo(resumeAddress)
    if (result?.displayName === resumeAddress) {
      result.displayName = getShortAddress(resumeAddress)
    }
    setUser(result)
    if (result?.id) {
      fetchFollowInfo(result.id)
    }
  }

  const fetchFollowInfo = async (userId: string) => {
    if (!userId) {
      return
    }
    const u = await getLatestUsers({ userId })
    if (u.items.length > 0) {
      setFollowers(u.items[0].followerCount)
      setFollowings(u.items[0].followingCount)
    }
  }

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

  // 获取当前用户最新职位信息, 用于展示用户名片上
  const fetchUserLatestCareer = async (resumeDataList: ResumeData) => {
    if (!resumeDataList?.career?.length) {
      return
    }
    // 找至今的职位
    const latestCareer = resumeDataList?.career?.find(item => item.isPresent) || resumeDataList?.career[0]
    if (latestCareer?.project && latestCareer?.role) {
      setProject(latestCareer.project)
      setRole(latestCareer.role)
    }
  }

  // 获取当前用户的简历
  const fetchUserResume = async (resumeAddress: string) => {
    if (!resumeAddress) {
      return message.error("fetchUserResume Error: resumeAddress can't be null")
    }
    const result = await getResume(resumeAddress)

    if (result?.data) {
      const resumeObj = covertCareerAndEdu(result.data)
      setResumeData(resumeObj)
      fetchUserLatestCareer(resumeObj)
    }
    // setLoading(false)
  }

  useEffect(() => {
    const currentAddress = address || account?.address
    if (currentAddress) {
      fetchUserInfoByAddress(currentAddress)
      fetchUserResume(currentAddress)
    }
  }, [address, account])

  return <ProfileContext.Provider value={profileMemo}>{children}</ProfileContext.Provider>
}

export const useProfileResume = () => {
  const profile = useContext(ProfileContext)
  return profile
}
