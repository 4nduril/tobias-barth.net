import { ReactNode } from 'react'
import { CVSection } from './CVSection'
import { CVTextContent } from './CVTextContent'
import { PageBreak } from './PageBreak'

export const ProfessionalExperience = () => {
  return (
    <CVSection title="Professional Experience">
      <MediaMarktSaturnDetails />
      <RapidDataDetails />
      <PageBreak />
      <AdditionalClientsProjects />
      <MobileDeDetails />
    </CVSection>
  )
}

const MediaMarktSaturnDetails = () => {
  return (
    <ExperienceItem
      company="MediaMarktSaturn Technology, München"
      title="Senior Frontend Developer (Freelance)"
      period="2019–2025"
      periodAddition="(three separate engagements: Oct 2023–Feb 2025 • May 2020–Dec 2020 • Aug 2019–Mar 2020)"
    >
      {/* Description */}
      <CVTextContent>
        <p>
          Brought in three times as senior frontend developer for the Foundation
          Team, responsible for horizontal concerns across 5-6 product teams
          building one of Europe’s largest e-commerce platforms.
        </p>

        <p>
          Took ownership of critical infrastructure work, leading initiatives
          from routing architecture to analytics systems while coordinating
          across team boundaries.
        </p>

        {/* Highlight */}
        <ExperienceSubsection title="Highlight: React Router 4 → 6.4 Migration">
          <p className="mb-2 print:mb-1">
            Led a multi-month, zero-downtime upgrade of the entire webshop’s
            routing infrastructure, coordinating with all product teams.
          </p>
          <ul className="list-disc ml-5 space-y-1.5 print:space-y-1">
            <li>
              Analyzed codebase usage, created team-specific migration plans,
              and broke down the upgrade into two phases (4&nbsp;→&nbsp;5.1,
              5.1&nbsp;→&nbsp;6.4) to enable gradual rollout
            </li>
            <li>
              Personally implemented changes across team boundaries, aligning
              approaches through code reviews and coordinated deployments
            </li>
            <li>
              Introduced React Router 6.4 data loaders organization-wide,
              improving Largest Contentful Paint by&nbsp;~33% through
              knowledge-sharing sessions
            </li>
          </ul>
        </ExperienceSubsection>

        {/* Additional Contributions */}
        <ExperienceSubsection title="Additional Contributions">
          <ul className="list-disc ml-5 space-y-1.5 print:space-y-1">
            <li>
              Architected and implemented RxJS-based tracking system for
              analytics, leading a small team of junior developers while
              replacing Google Analytics and ensuring GDPR compliance
            </li>
            <li>
              Contributed to frontend component library and SSR architecture
            </li>
          </ul>
        </ExperienceSubsection>

        {/* Tech Stack */}
        <p className="text-gray-700 mt-3 print:mt-2 print:text-black">
          <span className="font-semibold">Tech:</span> React, Koa, TypeScript,
          GraphQL, RxJS, Server-Side Rendering, Google Cloud Platform
        </p>
      </CVTextContent>
    </ExperienceItem>
  )
}

const RapidDataDetails = () => {
  return (
    <ExperienceItem
      company="RapidData GmbH, Berlin"
      title="Senior Frontend Developer (Freelance)"
      period="May 2022 – Dec 2022"
    >
      {/* Description */}
      <CVTextContent>
        <p>
          Leading ERP software provider for the funeral home industry in
          Germany.
        </p>

        {/* Highlight */}
        <ExperienceSubsection title="Highlight: Technical Leadership & Team Development">
          <p className="mb-2 print:mb-1">
            Became the most senior frontend developer after the previous lead’s
            departure, taking ownership of frontend architecture and mentoring
            two junior developers through their first professional React
            project.
          </p>
          <ul className="list-disc ml-5 space-y-1.5 print:space-y-1">
            <li>
              Established rigorous code review culture, using detailed feedback
              as primary mentoring tool to teach React patterns and best
              practices
            </li>
            <li>
              Made architectural decisions for frontend while collaborating
              closely with backend architect on API contracts and data flow
            </li>
            <li>
              Guided team through React adoption, introducing component
              architecture and state management patterns
            </li>
            <li>
              Built core UI components and features using React, Redux, and the
              company’s design system
            </li>
          </ul>
        </ExperienceSubsection>

        {/* Tech Stack */}
        <p className="text-gray-700 mt-3 print:mt-2 print:text-black">
          <span className="font-semibold">Tech:</span> React, Redux, RESTful
          APIs, Component/Design System
        </p>
      </CVTextContent>
    </ExperienceItem>
  )
}

const AdditionalClientsProjects = () => {
  return (
    <ExperienceItem
      company="Additional Client Projects (2017–2021)"
      title="Senior Frontend Developer (Freelance)"
    >
      {/* Description */}
      <CVTextContent>
        {/* Selected Projects */}
        <ExperienceSubsection title="Selected Projects">
          <ul className="list-disc ml-5 space-y-1.5 print:space-y-1">
            <li>
              <span className="font-semibold">
                Grapes GmbH{' '}
                <span className="font-normal">(today: regrapes)</span>{' '}
                (2018–2019, 2021):
              </span>{' '}
              Financial services (Bankverlag) and legal tech (Klugo)
              applications using React, TypeScript, GraphQL
            </li>
            <li>
              <span className="font-semibold">cyber:con (2017–2018):</span>{' '}
              Frontend coordination for Eurowings project, VueJS-based
              implementation
            </li>
            <li>
              <span className="font-semibold">nexum AG (2017):</span>{' '}
              React/Redux development for microspot.ch
            </li>
            <li>
              Various small and exploratory projects with Next.js, MobX, Docker,
              and emerging technologies
            </li>
          </ul>
        </ExperienceSubsection>

        {/* Tech Stack */}
        <p className="text-gray-700 mt-3 print:mt-2 print:text-black">
          <span className="font-semibold">Tech:</span> React, TypeScript,
          GraphQL, VueJS, Next.js, Redux, MobX, Docker
        </p>
      </CVTextContent>
    </ExperienceItem>
  )
}

const MobileDeDetails = () => {
  return (
    <ExperienceItem
      company="mobile.de, Berlin"
      title="Frontend Developer (Freelance)"
      period="Nov 2015 – Nov 2016"
    >
      {/* Description */}
      <CVTextContent>
        <p>Germany’s largest online automotive marketplace.</p>

        {/* Highlight */}
        <ExperienceSubsection title="Highlight: Early React Adoption">
          <p className="mb-2 print:mb-1">
            Part of a team pioneering JavaScript application development at
            mobile.de. Implemented the favorites feature using React (v0.14/15)
            – the first React implementation at the company.
          </p>
          <ul className="list-disc ml-5 space-y-1.5 print:space-y-1">
            <li>
              One of my first experiences working in a large development
              organization and established team processes
            </li>
            <li>
              Built scalable components when React patterns were still emerging
            </li>
          </ul>
        </ExperienceSubsection>

        {/* Tech Stack */}
        <p className="text-gray-700 mt-3 print:mt-2 print:text-black">
          <span className="font-semibold">Tech:</span> React (early versions),
          Backbone.js, Node.js
        </p>
      </CVTextContent>
    </ExperienceItem>
  )
}

const ExperienceItem = ({
  company,
  title,
  period,
  periodAddition,
  children,
}: {
  company: string
  title: string
  period?: string
  periodAddition?: string
  children: ReactNode
}) => {
  return (
    <div className="mb-8 print:mb-5">
      {/* Company & Title */}
      <div className="mb-3 print:mb-2">
        <h3 className="font-semibold text-xl lg:text-2xl print:text-lg">
          {company}
        </h3>
        <p className="text-gray-700 print:text-black">{title}</p>
        <p className="text-gray-700 italic print:text-black">{period}</p>
        {periodAddition && (
          <p className="text-gray-700 text-lg print:text-base italic print:text-black">
            {periodAddition}
          </p>
        )}
      </div>

      {/* Description */}
      <CVTextContent>{children}</CVTextContent>
    </div>
  )
}

const ExperienceSubsection = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <div className="mt-4 print:mt-2">
      <h4 className="font-semibold mb-2 print:mb-1">{title}</h4>
      {children}
    </div>
  )
}
