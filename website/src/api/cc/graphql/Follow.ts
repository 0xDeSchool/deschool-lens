import { gql } from "@apollo/client";

export const CC_FOLLOW = gql`
  mutation follow(
    $input: FollowInput!
  ) {
    follow(input: $input) {
      success
    }
  }
`;
