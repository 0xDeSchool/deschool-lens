import type { DefaultOptions } from '@apollo/client'
import { ApolloClient, ApolloLink, HttpLink, from, InMemoryCache } from '@apollo/client'
import { getToken } from '~/auth/user'
import { onError } from '@apollo/client/link/error'

const API_URL = import.meta.env.VITE_APP_LENS_API

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
  uri: import.meta.env.VITE_APP_LENS_API,
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
  const token = getToken()?.lens.accessToken

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      'x-access-token': token ? `Bearer ${token}` : '',
    },
  })

  // Call the next link in the middleware chain.
  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  uri: API_URL,
  cache: new InMemoryCache(),
  defaultOptions,
})
