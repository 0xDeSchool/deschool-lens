import type { ReactElement } from 'react'
import React, { useState, useEffect, useMemo, useContext, createContext } from 'react'
import type { LayoutContextProps } from '~/lib/types/app'

export const LayoutContext = createContext<LayoutContextProps>({
  theme: 'light',
  currentWidth: 1920,
  currentHeight: 1080,
  connectBoardVisible: false,
  layoutPosition: {},
  setConnectBoardVisible: () => {},
  setCurrentWidth: () => {},
  setCurrentHeight: () => {},
  setTheme: () => {},
  setLayoutPosition: () => {},
})

export const LayoutContextProvider = ({ children }: { children: ReactElement }) => {
  const [theme, setTheme] = useState('light')
  const [currentWidth, setCurrentWidth] = useState(1920)
  const [currentHeight, setCurrentHeight] = useState(1080)
  const [connectBoardVisible, setConnectBoardVisible] = useState(false)
  const [layoutPosition, setLayoutPosition] = useState({})

  const onWidthChange = () => {
    window.screenWidth = document.body.clientWidth
    setCurrentWidth(window.screenWidth)
  }

  const onHeightChange = () => {
    window.screenHeight = document.body.clientHeight
    setCurrentHeight(window.screenHeight)
  }

  window.onresize = () => {
    onWidthChange()
    onHeightChange()
  }

  useEffect(() => {
    onWidthChange()
    onHeightChange()
  })

  const layoutMemo = useMemo(
    () => ({
      theme,
      setTheme,
      currentWidth,
      setCurrentWidth,
      currentHeight,
      setCurrentHeight,
      connectBoardVisible,
      setConnectBoardVisible,
      layoutPosition,
      setLayoutPosition,
    }),
    [
      theme,
      setTheme,
      currentWidth,
      setCurrentWidth,
      currentHeight,
      setCurrentHeight,
      connectBoardVisible,
      setConnectBoardVisible,
      layoutPosition,
      setLayoutPosition,
    ],
  )

  return <LayoutContext.Provider value={layoutMemo}>{children}</LayoutContext.Provider>
}

export const useLayout = () => {
  const layout = useContext(LayoutContext)
  return layout
}
