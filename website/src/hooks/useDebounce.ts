import type { DependencyList } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { debounceTime, Subject } from 'rxjs'

export function useDebounce<T>(fn: (t: T) => void, delay = 300, deps: DependencyList = []) {
  const subject = useMemo(() => new Subject<T>(), [])
  useEffect(() => {
    const subscriber = subject.pipe(debounceTime(delay)).subscribe(fn)
    return () => {
      subscriber.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, delay, subject, ...deps])
  return useCallback((t: T) => subject.next(t), [subject])
}
