import { FunctionComponent } from 'react'
import SiteHead from './SiteHead'
import MainNavigation from './MainNavigation'
import MainContent from './MainContent'
import SiteFooter from './SiteFooter'

type LayoutProps = {
  lang?: string
}

export const Layout: FunctionComponent<LayoutProps> = ({ children, lang }) => (
  <>
    <SiteHead />
    <MainNavigation />
    <MainContent lang={lang}>{children}</MainContent>
    <SiteFooter />
  </>
)
