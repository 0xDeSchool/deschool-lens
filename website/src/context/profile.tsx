/* eslint-disable class-methods-use-this */
import message from 'antd/es/message'
import dayjs from 'dayjs'
import { Dispatch, ReactElement, SetStateAction, useState } from 'react'
import { useMemo, useEffect, useContext, createContext } from 'react'
import { useParams } from 'react-router'
import { useAccount } from '~/account'
import { getLatestUsers, getUserInfo } from '~/api/booth'
import { getResume } from '~/api/booth/booth'
import { checkfollowUser, FollowRelationType } from '~/api/booth/follow'
import { ResumeProject, UserInfo } from '~/api/booth/types'
import { ResumeCardData, ResumeData } from '~/pages/profile/resume/types'
import { getShortAddress } from '~/utils/format'

type ProfileContextProps = {
  loading: boolean
  user: UserInfo | null
  followers: number
  followings: number
  project: ResumeProject | null
  role: string | null
  loadingResume: boolean
  resumeData: any
  refreshUserResume: (resumeAddress: string) => void
  refreshUserInfo: () => void
}

export const ProfileContext = createContext<ProfileContextProps>({
  loading: true,
  user: null,
  followers: 0,
  followings: 0,
  project: null,
  role: null,
  resumeData: null,
  loadingResume: true,
  refreshUserInfo: () => {},
  refreshUserResume: () => {},
})

export const ProfileContextProvider = ({ children }: { children: ReactElement }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [followers, setFollowers] = useState<number>(0)
  const [followings, setFollowings] = useState<number>(0)
  const [project, setProject] = useState<ResumeProject | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loadingResume, setLoadingResume] = useState<boolean>(false)
  const [resumeData, setResumeData] = useState<any>(null)
  const { address } = useParams()
  const account = useAccount()

  // 检查是否关注
  const checkfollowRelationship = async (userId: string): Promise<boolean> => {
    // 如果是自己，不需要检查
    if (userId === account?.id) {
      return false
    }
    if (account?.id && userId) {
      const isFollowed: FollowRelationType | any = await checkfollowUser(userId, account?.id)
      return isFollowed.fromFollowedTo || false
    }
    return false
  }

  const fetchUserInfoByAddress = async (resumeAddress: string) => {
    const resUserInfo = await getUserInfo(resumeAddress)
    if (resUserInfo?.displayName === resumeAddress) {
      resUserInfo.displayName = getShortAddress(resumeAddress)
    }
    const isFollowedByMe = await checkfollowRelationship(resUserInfo.id)
    resUserInfo.isFollowedByMe = isFollowedByMe
    setUser(resUserInfo)
    if (resUserInfo?.id) {
      fetchFollowInfo(resUserInfo.id)
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

  const refreshUserResume = async (resumeAddress: string) => {
    if (!resumeAddress) {
      return message.error("fetchUserResume Error: resumeAddress can't be null")
    }
    const result = await getResume(resumeAddress)
    if (result?.data) {
      const resumeObj = covertCareerAndEdu(result.data)
      setResumeData(resumeObj)
      fetchUserLatestCareer(resumeObj)
    }
  }

  // 获取当前用户的简历
  const fetchUserResume = async (resumeAddress: string) => {
    try {
      if (loadingResume) {
        return
      }
      setLoadingResume(true)
      refreshUserResume(resumeAddress)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingResume(false)
    }
  }

  const initData = () => {
    const currentAddress = address || account?.address
    try {
      setLoading(true)
      if (currentAddress) {
        fetchUserResume(currentAddress)
        fetchUserInfoByAddress(currentAddress)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const refreshUserInfo = () => {
    const currentAddress = address || account?.address
    if (currentAddress) {
      fetchUserInfoByAddress(currentAddress)
    }
  }

  const profileMemo = useMemo(() => {
    return {
      loading,
      user,
      followers,
      followings,
      project,
      role,
      loadingResume,
      resumeData,
    }
  }, [loading, user, followers, followings, project, role, loadingResume, resumeData])

  const providerValue = {
    ...profileMemo,
    refreshUserInfo,
    refreshUserResume,
  }

  useEffect(() => {
    initData()
  }, [address, account])

  return <ProfileContext.Provider value={providerValue}>{children}</ProfileContext.Provider>
}

export const useProfileResume = () => {
  const profile = useContext(ProfileContext)
  return profile
}
