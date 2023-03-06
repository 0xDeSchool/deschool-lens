import type { DefaultOptions } from '@apollo/client'
import { ApolloClient, ApolloLink, HttpLink, from, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { getUserManager } from '~/account'
import { PlatformType } from '~/api/booth/booth'

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_APP_CYBERCONNECT_GRAPHQL_ENDPOINT,
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = new ApolloLink((operation, forward) => {
  const userContext = getUserManager().user
  const token = userContext?.platform(PlatformType.CYBERCONNECT)?.data?.accessToken
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      // 'Content-Type': 'application/json;charset=UTF-8',
      // 'Access-Control-Allow-Origin': '*',
      Authorization: token ? `bearer ${token}` : '',
      'X-API-KEY': import.meta.env.VITE_APP_CYBERCONNECT_API_KEY,
    },
  })

  // Call the next link in the middleware chain.
  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  uri: import.meta.env.VITE_APP_CYBERCONNECT_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  defaultOptions,
})
