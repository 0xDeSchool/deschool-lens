import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import type { UserPlatform } from '~/api/booth/types';
import { PRIMARY_PROFILE } from '~/api/cc/graphql';
import { GET_FOLLOWER_BY_HANDLE } from '~/api/cc/graphql/GetFollowersByHandle';
import { GET_FOLLOWING_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingsByAddressEVM';

const useCyberConnectProfile = () => {
  const [userLoading, setUserLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserPlatform>({} as UserPlatform)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowedByMe, setIsFollowedByMe] = useState(false)
  const [getPrimaryProfile] = useLazyQuery(PRIMARY_PROFILE);
  const [getFollowingByHandle] = useLazyQuery(GET_FOLLOWER_BY_HANDLE)
  const [getFollowingByAddressEVM] = useLazyQuery(GET_FOLLOWING_BY_ADDRESS_EVM)
  const [address, setAdress] = useState('')
  const [visitAddress, setVisitAddress] = useState('')

  // 获取用户的关注者
  const initUserFollowersInfo = async (handle: string, addressVal: string) => {
    const resp = await getFollowingByHandle({
      variables: {
        handle,
        me: addressVal,
      },
    })
    const primaryProfile = resp?.data?.profileByHandle
    setFollowerCount(primaryProfile?.followerCount || 0)
    setIsFollowedByMe(primaryProfile?.isFollowedByMe || false)
  }

  // 获取用户的关注的人
  const initUserFollowingsInfo = async (addressVal: string) => {
    const resp = await getFollowingByAddressEVM({
      variables: {
        address: addressVal,
      },
    })
    setFollowingCount(resp?.data?.address?.followingCount || 0)
  }

  // 根据不同情况初始化用户信息
  const initUserInfo = async (addressVal: string, visitAddressVal: string) => {
    if (userLoading) return
    setUserLoading(true)
    try {
      const res = await getPrimaryProfile({
        variables: {
          address: addressVal,
          me: visitAddressVal,
        },
      });
      const userInfo = res?.data?.address?.wallet?.primaryProfile
      // 此人没有handle，cyber没数据
      if (!userInfo) {
        setUserProfile({} as UserPlatform)
        return
      }
      let url = userInfo?.metadataInfo?.avatar
      if (url?.startsWith('ipfs://')) {
        url = url.replace('ipfs://', 'http://ipfs.io/ipfs/')
        userInfo.avatar = url
      }
      userInfo.bio = userInfo?.metadataInfo?.bio
      userInfo.displayName = userInfo?.metadataInfo?.displayName
      // 此人有数据
      setUserProfile(userInfo)
    } finally {
      setUserLoading(false)
    }
  }

  useEffect(() => {
    if (userProfile?.handle) {
      // 获取关注者信息
      initUserFollowersInfo(userProfile.handle, visitAddress)
      initUserFollowingsInfo(address)
    }
  }, [userProfile])

  const fetchUserInfo = useCallback(async (addressVal: string, visitAddressVal: string) => {
    setAdress(addressVal)
    setVisitAddress(visitAddressVal)
    await initUserInfo(address, visitAddressVal)
  }, [])

  const refreshFollowInfo = useCallback(async (handle: string) => {
    if (handle) {
      // 获取关注者信息
      initUserFollowersInfo(handle, visitAddress)
      initUserFollowingsInfo(address)
    }
  }, [address, visitAddress])

  return { userProfile, followerCount, followingCount, isFollowedByMe, userLoading, fetchUserInfo, refreshFollowInfo }
}
export default useCyberConnectProfile
