import { gql } from '@apollo/client'
export const GET_FOLLOWING_LIST_BY_ADDRESS_EVM = gql`
  query getFollowingsByAddressEVM($address: AddressEVM!) {
    address(address: $address) {
      followingCount
      followings {
        totalCount
        edges {
          node {
            handle
            address
          }
        }
        pageInfo {
          hasPreviousPage
          startCursor
          hasNextPage
        }
      }
    }
  }
`;
