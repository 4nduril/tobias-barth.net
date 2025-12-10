import { CVSection } from './CVSection'

export const ContinuousLearning = () => {
  return (
    <CVSection title="Continuous Learning & Exploration">
      <div className="space-y-3 print:space-y-2 print:text-sm">
        <p className="print:text-justify print:hyphens-auto">
          Between client projects, I maintain a rhythm of focused work
          alternating with self-directed learning periods. These intervals are
          dedicated to:
        </p>

        <ul className="list-disc ml-5 space-y-1.5 print:space-y-1">
          <li className="print:text-justify print:hyphens-auto">
            Exploring and evaluating emerging technologies
          </li>
          <li className="print:text-justify print:hyphens-auto">
            Building prototypes and side projects (SMASH, One Thought A Day)
          </li>
          <li className="print:text-justify print:hyphens-auto">
            Deep-diving into performance optimization and accessibility
          </li>
          <li className="print:text-justify print:hyphens-auto">
            Staying current with React ecosystem evolution
          </li>
        </ul>

        <p className="print:text-justify print:hyphens-auto">
          This pattern has been core to my freelance practice for 15 years,
          enabling me to bring fresh perspectives and up-to-date knowledge to
          each engagement.
        </p>
      </div>
    </CVSection>
  )
}
