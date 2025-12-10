import { CVSection } from './CVSection'
import { CVTextContent } from './CVTextContent'

// Professional Summary Component
export const ProfessionalSummary = () => {
  return (
    <CVSection title="Professional Summary">
      <CVTextContent>
        <p>
          Senior Frontend Developer with 15 years of freelance experience,
          seeking a permanent senior or lead role where I can write code daily
          while taking ownership of architectural decisions and mentoring
          through hands-on collaboration.
        </p>
        <p>
          Throughout my freelance career – from early React adoption in 2016 to
          modern server components – I’ve built deep expertise in the React
          ecosystem, performance optimization, and cross-team coordination.
          Recent projects like implementing a company-wide RxJS tracking system
          and personally migrating multi-team codebases to React Router 6.4 have
          shown me that I want more: long-term responsibility for technical
          direction while staying deeply hands-on.
        </p>
        <p>
          Beyond client work, I build full-stack products (SMASH, One Thought A
          Day) that combine technical depth with product thinking. I understand
          systems deeply, communicate clearly across technical levels, and
          mentor naturally through code reviews and pairing.
        </p>
        <p>
          Looking for a hands-on senior/staff role where I can implement
          solutions, shape architectural decisions, and guide teams through
          example and collaboration – not from the sidelines.
        </p>
      </CVTextContent>
    </CVSection>
  )
}
