import { gql } from "@apollo/client";

export const CC_UNFOLLOW = gql`
  mutation unfollow(
    $input: UnfollowInput!
  ) {
    unfollow(input: $input) {
      success
    }
  }
`;
