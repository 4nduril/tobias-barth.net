import { FC, ReactNode } from 'react'

type MainContentProps = {
  lang?: string
  children?: ReactNode
}

const MainContent: FC<MainContentProps> = ({ children, lang }) => (
  <main {...{ lang }} className="mx-auto mb-7 max-w-prose px-4 xl:px-0">
    {children}
  </main>
)

export default MainContent
