import { FunctionComponent, ReactNode } from 'react'
import MainNavigation from '../../components/MainNavigation'

const DefaultLayout: FunctionComponent = ({
  children,
}: {
  children?: ReactNode
}) => (
  <>
    <MainNavigation />
    {children}
  </>
)
export default DefaultLayout
