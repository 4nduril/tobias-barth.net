import { CVSection } from './CVSection'
import { CVTextContent } from './CVTextContent'

export const ProductDevelopment = () => {
  return (
    <CVSection title="Product Development & Entrepreneurship">
      {/* One Thought A Day */}
      <div className="mb-8 print:mb-5">
        {/* Title */}
        <div className="mb-3 print:mb-2">
          <h3 className="font-semibold text-xl lg:text-2xl print:text-lg">
            One Thought A Day – Journaling SaaS
          </h3>
          <p className="text-gray-700 print:text-black">
            Founder & Full-Stack Developer | 2025 – Present
          </p>
          <p className="text-gray-700 italic print:text-black">
            Planned launch: February 2026
          </p>
        </div>

        {/* Description */}
        <CVTextContent>
          <p>
            A journaling app inspired by “One Line A Day” notebooks, designed
            for reflection and mindfulness. Each day, users write one thought,
            and over the years, entries stack vertically on the same
            date—creating a personal timeline that reveals patterns, growth, and
            change over time. Currently in alpha with select users, preparing
            for public launch with subscription model.
          </p>

          {/* Technical & Product Highlights */}
          <div className="mt-4 print:mt-2">
            <h4 className="font-semibold mb-2 print:mb-1">
              Technical & Product Highlights:
            </h4>
            <ul className="list-disc ml-5 space-y-1.5 print:space-y-1">
              <li>
                End-to-end development: MVP design, frontend, backend,
                authentication, payment integration
              </li>
              <li>
                Focus on simplicity and reflection – one entry per day, viewed
                in context of past years
              </li>
              <li>
                Testing core value proposition with real users before full
                launch
              </li>
              <li>
                Learning curve: SaaS business model, payment provider
                integration, subscription management, user onboarding flows
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <p className="text-gray-700 mt-3 print:mt-2 print:text-black">
            <span className="font-semibold">Tech:</span> Next.js, React,
            Tailwind CSS, Prisma, PostgreSQL, Vercel
          </p>

          {/* Key Learning */}
          <div className="mt-3 print:mt-2">
            <p>
              <span className="font-semibold">Key Learning:</span> Going from
              concept to paid product – MVP thinking, iterating based on user
              feedback, and transitioning from free alpha to commercial launch.
            </p>
          </div>
        </CVTextContent>
      </div>

      {/* SMASH */}
      <div className="mb-8 print:break-before-page print:mb-5">
        {/* Title */}
        <div className="mb-3 print:mb-2">
          <h3 className="font-semibold text-xl lg:text-2xl print:text-lg">
            SMASH – Flat Swapping Platform
          </h3>
          <p className="text-gray-700 print:text-black">
            Founder & Full-Stack Developer | 2021 – Present
          </p>
          <p className="text-gray-700 print:text-black">
            <a
              href="https://smash-housing.com"
              className="print:text-black print:no-underline"
            >
              smash-housing.com
            </a>
          </p>
        </div>

        {/* Description */}
        <CVTextContent>
          <p>
            A free matching platform designed to make housing more accessible by
            connecting people wanting to swap flats. Built as a counterweight to
            the increasingly expensive housing (search) market.
          </p>

          <p>
            Instead of endless search lists and complex filters, users see one
            offer at a time in a Tinder-like interface, with bidirectional
            matching ensuring both parties’ needs align before connection.
          </p>

          {/* Technical & Product Highlights */}
          <div className="mt-4 print:mt-2">
            <h4 className="font-semibold mb-2 print:mb-1">
              Technical & Product Highlights:
            </h4>
            <ul className="list-disc ml-5 space-y-1.5 print:space-y-1">
              <li>
                Full ownership: concept, UX design, architecture,
                implementation, deployment, and maintenance
              </li>
              <li>
                Built matching algorithm considering bidirectional preferences
                (not just one-way search results)
              </li>
              <li>~200 active profiles, ~50 monthly active users</li>
              <li>
                Recent evolution (2025): Migrated from fixed city list to
                geocoding solution covering entire DACH region – most requested
                feature
              </li>
              <li>
                Deliberately free to use, prioritizing social impact over
                revenue
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <p className="text-gray-700 mt-3 print:mt-2 print:text-black">
            <span className="font-semibold">Tech:</span> Next.js, React,
            MaterialUI, MongoDB, Vercel, Geocoding APIs
          </p>

          {/* Key Learning */}
          <div className="mt-3 print:mt-2">
            <p>
              <span className="font-semibold">Key Learning:</span> Building and
              maintaining a product end-to-end – from identifying user needs to
              implementing technical solutions to iterating based on real
              feedback.
            </p>
          </div>
        </CVTextContent>
      </div>
    </CVSection>
  )
}
