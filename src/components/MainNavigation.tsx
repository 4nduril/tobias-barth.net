import Link from 'next/link'
import { FunctionComponent } from 'react'

const MainNavigation: FunctionComponent = () => {
  return (
    <nav className="mb-7 pb-1 font-bold bg-primary">
      <ul className="flex justify-around list-none">
        {/* <li className="flex-grow mx-8 text-center">
          <Link href="/portfolio">
            <a
              className="inline-block text-gray-200 no-underline px-4 py-2 hover:bg-link-color transition-colors"
              title="Meine Fähigkeiten, Arbeitsfelder und Beispielprojekte"
            >
              Ich mache
            </a>
          </Link>
		</li> */}
        <li className="flex-grow mx-8 text-center">
          <Link
            href="/blog"
            className="inline-block text-gray-200 no-underline px-4 py-2 hover:bg-link-color transition-colors"
            title="Mein Blog über Webentwicklung und Ähnliches"
          >
            Blog
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default MainNavigation
