import { gql } from '@apollo/client'

export const GET_RECOMENDED_EVENTS = gql`
  query getRecomendedEvents($first: Int, $filter: TrendingEventsRequest_EventFilter) {
    trendingEvents(first: $first, filter: $filter) {
      pageInfo {
        hasNextPage
      }
      list {
        id
        title
        tags
        posterUrl
        startTimestamp
        endTimestamp
        createTimestamp
        status
        visibility
        registrantsCount
      }
    }
  }
`;
