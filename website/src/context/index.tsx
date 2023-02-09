import type { ReactElement } from 'react'
import { createContext } from 'react'
import { AccountContextProvider } from './account'
import { LayoutContextProvider } from './layout'

// 集成多个context,对外提供一个provider
const AllContext = createContext({})
const AllContextProvider = ({ children }: { children: ReactElement }) => (
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  <AllContext.Provider value={{}}>
    <LayoutContextProvider>
      <AccountContextProvider>{children}</AccountContextProvider>
    </LayoutContextProvider>
  </AllContext.Provider>
)

export default AllContextProvider
