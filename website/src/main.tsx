import { createRoot } from 'react-dom/client'
import ConfigProvider from 'antd/es/config-provider'
import { ApolloProvider } from '@apollo/client'
import RouterObj from './router'
import AllContextProvider from './context'
import './styles/fonts.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles/index.css'
import 'antd/dist/reset.css'
import './styles/custom.css'
import './locales/i18n.ts'
import { apolloClient } from './api/cc/apollo'

// import mockXHR from './mock'

const rootDom = document.getElementById('root')

// if (process.env.VITE_APP_ENV === 'development') {
//   mockXHR()
// }

const root = createRoot(rootDom!) // createRoot(container!) if you use TypeScript
root.render(
  <ApolloProvider client={apolloClient}>
    <AllContextProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#6525FF',
            colorPrimaryActive: '#4a16d9',
            colorPrimaryBgHover: '#6525FF',
            colorPrimaryBorder: '#6525FF',
            colorPrimaryBorderHover: '#a855f7',
            colorPrimaryHover: '#a855f7',
            colorBgBase: '#ffffff',
            colorPrimaryText: '#6525FF',
            colorPrimaryTextActive: '#4a16d9',
            colorPrimaryTextHover: '#a855f7',
          },
          components: {
            Radio: {
              colorPrimary: '#6525FF',
            },
            Input: {
              // borderRadius: 0,
            },
          },
        }}
      >
        <RouterObj />
      </ConfigProvider>
    </AllContextProvider>
  </ApolloProvider>,
)
