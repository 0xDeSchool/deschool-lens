import { gql } from '@apollo/client'
export const GET_RECOMENDED_EVENTS = gql`
  query getRecomendedEvents($first: Int) {

    trendingEvents(first: $first) {
      pageInfo {
        hasNextPage
      }
      list {
        id
        title
        language
        tags
        info
        recap
        posterUrl
        startTimestamp
        endTimestamp
        createTimestamp
        status
        visibility
        speakers {
          twitterId
          twitterHandle
          displayName
          avatar
          avatarFrameTokenId
          title
          profileId
          twitterFollowers
        }
        registrantsCount
        lightInfo {
          hasRaffle
          hasW3ST
        }
      }
    }
  }
`;
