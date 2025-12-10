import { CVSection } from './CVSection'

export const CoreCompetencies = () => {
  return (
    <CVSection title="Core Competencies">
      <div className="space-y-4 print:space-y-2 print:text-sm">
        {/* Frontend Development */}
        <div>
          <h3 className="font-semibold mb-1 print:mb-0.5">
            Frontend Development (10+ years)
          </h3>
          <p className="text-gray-700 print:text-black">
            JavaScript&nbsp;• TypeScript&nbsp;• React&nbsp;• Next.js&nbsp;•
            HTML5&nbsp;• CSS3
          </p>
        </div>

        {/* Modern React Ecosystem */}
        <div>
          <h3 className="font-semibold mb-1 print:mb-0.5">
            Modern React Ecosystem
          </h3>
          <p className="text-gray-700 print:text-black">
            Server Components&nbsp;• Server-Side Rendering (SSR)&nbsp;• Static
            Site Generation (SSG)&nbsp;• React Router&nbsp;• State Management
            (Redux, MobX, Context API)
          </p>
        </div>

        {/* Backend & Full-Stack */}
        <div>
          <h3 className="font-semibold mb-1 print:mb-0.5">
            Backend & Full-Stack
          </h3>
          <p className="text-gray-700 print:text-black">
            Node.js&nbsp;• GraphQL&nbsp;• REST APIs&nbsp;• MongoDB&nbsp;•
            PostgreSQL&nbsp;• Prisma
          </p>
        </div>

        {/* Architecture & Infrastructure */}
        <div>
          <h3 className="font-semibold mb-1 print:mb-0.5">
            Architecture & Infrastructure
          </h3>
          <p className="text-gray-700 print:text-black">
            Component Libraries&nbsp;• Design Systems&nbsp;• Performance
            Optimization
          </p>
        </div>

        {/* Development Practices */}
        <div>
          <h3 className="font-semibold mb-1 print:mb-0.5">
            Development Practices
          </h3>
          <p className="text-gray-700 print:text-black">
            Accessibility (WCAG)&nbsp;• Responsive Design&nbsp;• Mobile
            First&nbsp;• Test-Driven Development&nbsp;• Agile/Scrum&nbsp;•
            Cross-Team Coordination&nbsp;• Code Review Culture&nbsp;• Mentoring
          </p>
        </div>

        {/* Tools & Platforms */}
        <div>
          <h3 className="font-semibold mb-1 print:mb-0.5">Tools & Platforms</h3>
          <p className="text-gray-700 print:text-black">
            Git&nbsp;• Docker&nbsp;• Vercel&nbsp;• Google Cloud Platform (incl.
            Kubernetes)&nbsp;• Tailwind CSS&nbsp;• MaterialUI&nbsp;• Storybook
          </p>
        </div>

        {/* Programming Concepts */}
        <div>
          <h3 className="font-semibold mb-1 print:mb-0.5">
            Programming Concepts
          </h3>
          <p className="text-gray-700 print:text-black">
            Functional Programming&nbsp;• RxJS/Reactive Programming
          </p>
        </div>

        {/* Languages */}
        <div>
          <h3 className="font-semibold mb-1 print:mb-0.5">Languages</h3>
          <p className="text-gray-700 print:text-black">
            German (native)&nbsp;• English (fluent)&nbsp;• Spanish (learning)
          </p>
        </div>
      </div>
    </CVSection>
  )
}
