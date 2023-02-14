import { ApolloClient, InMemoryCache } from '@apollo/client'

const API_URL = 'https://api.lens.dev'

/* create the API client */
export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
})