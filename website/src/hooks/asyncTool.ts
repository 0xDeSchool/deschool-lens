import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useUnmounted
 * @returns boolean
 * whether the component is unmounted
 */
export function useUnmounted() {
  const unmountedRef = useRef(false)
  useEffect(
    () => () => {
      unmountedRef.current = true
    },
    [],
  )
  return unmountedRef.current
}
/**
 * @method useAsyncState
 * Prevent React state update on an unmounted component.
 */
export function useAsyncState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const unmountedRef = useUnmounted()
  const [state, setState] = useState(initialState)
  const setAsyncState = useCallback((s: any) => {
    if (unmountedRef) return
    setState(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [state, setAsyncState]
}
