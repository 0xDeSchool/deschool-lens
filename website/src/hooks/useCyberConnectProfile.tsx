import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { UserPlatform } from '~/api/booth/types';
import { PRIMARY_PROFILE } from '~/api/cc/graphql';
import { GET_FOLLOWER_BY_HANDLE } from '~/api/cc/graphql/GetFollowersByHandle';
import { GET_FOLLOWING_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingsByAddressEVM';
import { ipfsUrl } from '~/utils/ipfs';

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
  const initUserFollowersInfo = async (handle: string, address: string) => {
    const resp = await getFollowingByHandle({
      variables: {
        handle,
        me: address,
      },
    })
    const primaryProfile = resp?.data?.profileByHandle
    setFollowerCount(primaryProfile?.followerCount || 0)
    setIsFollowedByMe(primaryProfile?.isFollowedByMe || false)
  }

  // 获取用户的关注的人
  const initUserFollowingsInfo = async (address: string) => {
    const resp = await getFollowingByAddressEVM({
      variables: {
        address,
      },
    })
    setFollowingCount(resp?.data?.address?.followingCount || 0)
  }

  // 根据不同情况初始化用户信息
  const initUserInfo = async (address: string, visitAddress: string) => {
    if (userLoading) return
    setUserLoading(true)
    try {
      const res = await getPrimaryProfile({
        variables: {
          address,
          me: visitAddress,
        },
      });
      const userInfo = res?.data?.address?.wallet?.primaryProfile
      // 此人没有handle，cyber没数据
       // 此人没有handle，cyber没数据
       if (!userInfo) {
        setUserProfile({} as UserPlatform)
        return
      }
      let url = userInfo?.metadataInfo?.avatar
      if (url?.startsWith('ipfs://')) {
        url = ipfsUrl(url)
      }
      userInfo.avatar = url
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
      initUserFollowersInfo(address, visitAddress)
      initUserFollowingsInfo(address)
    }
  }, [userProfile])

  const fetchUserInfo = useCallback(async (address: string, visitAddress: string) => {
    setAdress(address)
    setVisitAddress(visitAddress)
    await initUserInfo(address, visitAddress)
  }, [])

  const refreshFollowInfo = useCallback(async () => {
    if (userProfile?.handle) {
      // 获取关注者信息
      initUserFollowersInfo(address, visitAddress)
      initUserFollowingsInfo(address)
    }
  }, [])

  return { userProfile, followerCount, followingCount, isFollowedByMe, userLoading, fetchUserInfo, refreshFollowInfo }
}
export default useCyberConnectProfile
