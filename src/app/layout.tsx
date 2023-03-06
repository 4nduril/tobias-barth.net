import PlausibleProvider from 'next-plausible'
import { PT_Sans } from 'next/font/google'
import '../styles/global.css'
import SiteHead from '../components/SiteHead'
import SiteFooter from '../components/SiteFooter'

const ptSans = PT_Sans({
  variable: '--font-ptsans',
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin-ext'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className={`text-lg lg:text-xl leading-snug ${ptSans.variable}`}>
        <PlausibleProvider domain="tobias-barth.net">
          <SiteHead />
          {children}
          <SiteFooter />
        </PlausibleProvider>
      </body>
    </html>
  )
}
