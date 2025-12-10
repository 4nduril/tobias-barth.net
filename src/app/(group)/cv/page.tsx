import { ContinuousLearning } from './ContinuousLearning'
import { CoreCompetencies } from './CoreCompetencies'
import { CVHeader } from './CVHeader'
import { Education } from './Education'
import { PageBreak } from './PageBreak'
import { ProductDevelopment } from './ProductDevelopment'
import { ProfessionalExperience } from './ProfessionalExperience'
import { ProfessionalSummary } from './ProfessionalSummary'

export default function Page() {
  return (
    <CVContainer>
      <CVHeader />
      <ProfessionalSummary />
      <CoreCompetencies />
      <PageBreak />
      <ProfessionalExperience />
      <ProductDevelopment />
      <ContinuousLearning />
      <Education />
    </CVContainer>
  )
}

// CV Container Component
const CVContainer = ({ children }) => {
  return (
    <main
      lang="en"
      className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl print:px-0 print:py-0 print:max-w-none"
    >
      <article>{children}</article>
    </main>
  )
}
