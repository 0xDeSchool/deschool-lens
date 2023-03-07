import { gql } from '@apollo/client'

export const GET_FOLLOWER_LIST_BY_HANDLE = gql`
  query getFollowersByHandle($handle: String!, $me: AddressEVM!, $first: Int!) {
    profileByHandle(handle: $handle) {
      followerCount
      isFollowedByMe(me: $me)
      followers(first: $first) {
        totalCount
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            address {
              address
            }
            profile {
              id
              handle
              avatar
              isFollowedByMe(me: $me)
              metadataInfo {
                bio
                avatar
                displayName
                coverImage
              }
            }
          }
        }
      }
    }
  }`;
