import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GET_RECOMENDED_EVENTS } from '~/api/cc/graphql/GetRecommand';

const client = new ApolloClient({
  uri: 'ccProfile',
  cache: new InMemoryCache(),
});

const PAGE_SIZE = 20;

const useCCProfile = (defaultPage: number) => {
  const [recomendedEvents, setRecomendedEvents] = useState<RecomendedEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(defaultPage);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const value = useMemo(() => recomendedEvents, [recomendedEvents])

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true)
        const result = await client.query({query: GET_RECOMENDED_EVENTS, variables: {first: PAGE_SIZE * page}})
        setRecomendedEvents(result.data.trendingEvents.list)
        console.log('result', result.data.trendingEvents.pageInfo.hasNextPage)
      } catch (error: Error | unknown) {
        setHasNextPage(false)
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
  }, [page])

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      setPage(page + 1)
    }
  }, [page])

  return {loading, error, value, hasNextPage, loadMore}
}

export default useCCProfile;
