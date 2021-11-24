import React, { FC } from 'react'
import { AppProps } from 'next/app'
import '../styles/global.css'
import { ThemeProvider, theme } from '../utils/theme'
import PlausibleProvider from 'next-plausible'

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <PlausibleProvider domain="tobias-barth.net">
    <ThemeProvider value={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </PlausibleProvider>
)

export default App
