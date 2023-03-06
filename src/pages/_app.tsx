import React, { FC } from 'react'
import { AppProps } from 'next/app'
import '../styles/global.css'
import { ThemeProvider, theme } from '../utils/theme'
import PlausibleProvider from 'next-plausible'
import { PT_Sans } from 'next/font/google'

const ptSans = PT_Sans({
  variable: '--font-ptsans',
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin-ext'],
})

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <PlausibleProvider domain="tobias-barth.net">
    <ThemeProvider value={theme}>
      <div className={` ${ptSans.variable}`}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  </PlausibleProvider>
)

export default App
