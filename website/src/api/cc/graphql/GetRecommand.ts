import { gql } from '@apollo/client'
export const GET_RECOMENDED_EVENTS = gql`
  query getRecomendedEvents($first: Int) {
    trendingEvents(first: $first) {
      list {
        id
        title
      }
    }
  }
`;
