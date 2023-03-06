import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EventItem, EventMatchedItem, filterEvents } from '~/api/booth/event';
import { GET_RECOMENDED_EVENTS } from '~/api/cc/graphql/GetRecommand';
import { getUserContext } from '~/context/account';

const client = new ApolloClient({
  uri: 'ccProfile',
  cache: new InMemoryCache(),
});

const PAGE_SIZE = 20;

export type MatchedEvent = RecomendedEvents & EventMatchedItem

const useCCProfile = (defaultPage: number) => {
  const [recomendedEvents, setRecomendedEvents] = useState<MatchedEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(defaultPage);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const value = useMemo(() => recomendedEvents, [recomendedEvents])
  const [defaultRecommandEvent, setDefaultRecommandEvent] = useState<RecomendedEvents | null>()

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true)
        const result = await client.query({
          query: GET_RECOMENDED_EVENTS, variables: {
            first: PAGE_SIZE * page
          }
        })
        const list: MatchedEvent[] = result?.data?.trendingEvents?.list ?? []
        const request = {
          events: list.map((e: RecomendedEvents) => ({ id: e.id, labels: e.tags })),
          address: getUserContext().address,
          users: [],
        }

        const filtered = await filterEvents(request)

        const events: MatchedEvent[] = []

        for (let i = 0; i < list.length; i++) {
          if (filtered[i]?.isEnabled) {
            events.push({ ...list[i], ...filtered[i] })
          }
        }

        // 如果没有推荐的事件，就将第一个设置为默认的推荐事件
        if (events.length === 0) {
          setDefaultRecommandEvent(list[0])
        }

        setRecomendedEvents(events)
        setHasNextPage(result?.data?.trendingEvents?.pageInfo?.hasNextPage)
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
  }, [page, hasNextPage])

  return { loading, error, value, defaultRecommandEvent, hasNextPage, loadMore }
}

export default useCCProfile;
