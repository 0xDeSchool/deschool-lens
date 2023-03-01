import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { GET_RECOMENDED_EVENTS } from '~/api/cc/graphql/GetRecommand';

const client = new ApolloClient({
  uri: 'ccProfile',
  cache: new InMemoryCache(),
});

export const useCCProfile = () => {
  const [recomendedEvents, setRecomendedEvents] = useState<RecomendedEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const value = useMemo(() => recomendedEvents, [recomendedEvents]);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true)
        const result = await client.query({query: GET_RECOMENDED_EVENTS})
        console.log('result======', result)
        setRecomendedEvents(result.data.trendingEvents.list)
      } catch (error: Error | unknown) {
        if (error instanceof Error) {
          setError(error)
        } else {
          setError(new Error('Unknown error'))
        }
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [])
  return [value]
}
