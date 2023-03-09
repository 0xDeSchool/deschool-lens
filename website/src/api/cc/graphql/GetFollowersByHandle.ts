import { gql } from '@apollo/client'

export const GET_FOLLOWER_BY_HANDLE = gql`
  query getFollowersByHandle($handle: String!, $me: AddressEVM!) {
    profileByHandle(handle: $handle) {
      followerCount
      isFollowedByMe(me: $me)
    }
  }`;
