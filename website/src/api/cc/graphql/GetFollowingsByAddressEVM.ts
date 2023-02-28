import { gql } from '@apollo/client'
export const GET_FOLLOWING_BY_ADDRESS_EVM = gql`
  query getFollowingsByAddressEVM($address: AddressEVM!) {
    address(address: $address) {
      followingCount
    }
  }
`;
