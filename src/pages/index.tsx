import Head from 'next/head'
import { FunctionComponent } from 'react'
import SiteHead from '../components/SiteHead'
import MainNavigation from '../components/MainNavigation'
import SiteFooter from '../components/SiteFooter'
import { Portrait } from '../components/Portrait'

const Home: FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Tobias Barth – Web Freelancer aus Berlin</title>
        <meta
          name="description"
          content="Web Development aus Berlin. Als Freelancer bringe ich viel Erfahrung mit – aus Projekten in eCommerce, Banking oder Travel. Spezialist in Single-Page-Applications mit React."
        />
      </Head>
      <SiteHead />
      <main className="bg-primary text-gray-200">
        <div className="container mx-auto flex justify-between flex-wrap pb-7">
          <div className="md:w-1/2 xl:max-w-prose mx-4">
            <p className="mb-7">
              Hallo, mein Name ist Tobias Barth. Ich bin{' '}
              <strong>freiberuflicher Frontend-Entwickler</strong>. Ich arbeite
              seit 2011 in der Web-Entwicklung und im Web-Design.{' '}
              <em>Barrierefreiheit bzw. Accessibility</em> und gerätunabhängige
              Bedienbarkeit (<em>responsive Design</em>) gehören
              selbstverständlich zu meiner täglichen Arbeit. Für die meisten
              meiner Kunden verstärke ich projektbezogen ihr Team. Egal ob
              Startup, etablierter Player oder großes Ecommerce-Umfeld, ich
              bereichere mit Erfahrung, erprobten Best-Practices und kreativen
              Ideen jedes Projekt. Ich komme aus Köln, lebe in Berlin und
              arbeite für Sie, wo Sie mich brauchen, natürlich auch problemlos
              remote.
            </p>
            <p className="mb-7">
              Ich komme ursprünglich aus dem klassischen HTML/CSS-Bereich. Seit
              längerer Zeit arbeite ich hauptsächlich mit JavaScript-basierten
              Single-Page-Applications, meistens in React. Ich habe seit 2015
              Erfahrung mit{' '}
              <a className="text-current" href="https://reactjs.org/">
                ReactJS
              </a>
              , Meta-Frameworks wie{' '}
              <a className="text-current" href="https://nextjs.org/">
                NextJS
              </a>{' '}
              und dem gängigen Ökosystem um diese Bibliotheken herum.
            </p>
            <p className="mb-7">
              Ich bin zusammen mit meiner Frau Gründer der{' '}
              <a className="text-current" href="https://smash-housing.com">
                Wohnungstauschbörse SMASH
              </a>
              , deren gesamte Implementierung von mir ist. Außerdem habe ich{' '}
              <a className="text-current" href="https://as-time-goes-by.dev">
                As Time Goes By
              </a>{' '}
              als Spaß-Projekt geschrieben.
            </p>
          </div>
          <Portrait />
        </div>
      </main>
      <MainNavigation />
      <SiteFooter />
    </>
  )
}
export default Home
