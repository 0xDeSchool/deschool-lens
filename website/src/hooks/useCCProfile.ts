import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from '~/account';
import type { EventMatchedItem, FilterEventsRequest } from '~/api/booth/event';
import { filterEvents } from '~/api/booth/event';
import { GET_RECOMENDED_EVENTS } from '~/api/cc/graphql/GetRecommand';

const client = new ApolloClient({
  uri: 'ccProfile',
  cache: new InMemoryCache(),
});

const PAGE_SIZE = 10;

export type MatchedEvent = RecomendedEvents & EventMatchedItem

const useCCProfile = (defaultPage: number) => {
  const [recomendedEvents, setRecomendedEvents] = useState<MatchedEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(defaultPage);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const value = useMemo(() => recomendedEvents, [recomendedEvents])
  const [defaultRecommandEvent, setDefaultRecommandEvent] = useState<MatchedEvent | null>()

  const user = useAccount()

  // 根据推荐的事件，获取推荐的课程
  const fetchCourseByEvents = async (list: MatchedEvent[]): Promise<any[]> => {
    const events = list.map((item: RecomendedEvents) => ({id: item.id, labels: item.tags}))
    if (!user?.id) {
      return []
    }
    const request: FilterEventsRequest = {
      events,
      userId: user.id,
      users: [],
    }
    const filtered = await filterEvents(request)
    return filtered?.length > 0 ? filtered : []
  }

  // 合成数据
  const mergeData = (list: MatchedEvent[], filteredCourseList: any[]) => {
    const events: MatchedEvent[] = []

    // 将推荐的课程和推荐的事件合并， 如果有对应的推荐课程，就将推荐课程的信息合并到推荐事件中
    if (filteredCourseList.length > 0 && filteredCourseList.some((item: any) => item?.isEnabled)) {
      for (let i = 0; i < list.length; i++) {
        if (filteredCourseList[i]?.isEnabled) {
          events.push({ ...list[i], ...filteredCourseList[i] })
        }
      }
    }

    // 如果没有推荐的课程，就将第一个设置为默认的推荐课程
    if (events.length === 0) {
      setDefaultRecommandEvent(list[0])
    } else {
      setDefaultRecommandEvent(null)
    }

    setRecomendedEvents(events)
  }

  // 获取推荐的事件
  const initData = async () => {
    try {
      setLoading(true)
      const result = await client.query({
        query: GET_RECOMENDED_EVENTS, variables: {
          first: PAGE_SIZE * page,
        },
      })
      const list: MatchedEvent[] = result?.data?.trendingEvents?.list ?? []

      const filteredCourseList = await fetchCourseByEvents(list)
      mergeData(list, filteredCourseList)
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

  // 刷新推荐数据
  const refreshEventsData = async (list: MatchedEvent[]) => {
    const filteredCourseList = await fetchCourseByEvents(list)
    mergeData(list, filteredCourseList)
  }

  useEffect(() => {
    initData()
  }, [page,user])

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      setPage(page + 1)
    }
  }, [page, hasNextPage])

  const refresh = useCallback(() => {refreshEventsData(recomendedEvents)}, [recomendedEvents])

  return { loading, error, value, defaultRecommandEvent, hasNextPage, loadMore, refresh }
}

export default useCCProfile;
