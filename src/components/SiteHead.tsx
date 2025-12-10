import Link from 'next/link'
import { FunctionComponent } from 'react'

const SiteHead: FunctionComponent = () => {
  return (
    <div className="bg-primary print:hidden">
      <header className="container mx-auto flex justify-end text-gray-200">
        <Link href="/" className="text-current no-underline px-4 lg:px-0">
          <p className={`font-display text-5xl text-right logo-shadow mt-7`}>
            tobias-barth.net
          </p>
          <p
            className={`mb-7 font-display font-light text-3xl leading-none text-right logo-shadow`}
          >
            Web Freelancer aus Berlin
          </p>
        </Link>
      </header>
    </div>
  )
}

export default SiteHead
