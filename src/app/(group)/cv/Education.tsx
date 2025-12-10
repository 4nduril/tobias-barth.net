import { CVSection } from './CVSection'

export const Education = () => {
  return (
    <CVSection title="Education">
      <div className="print:text-sm">
        <div className="mb-3 print:mb-2">
          <h3 className="font-semibold text-xl lg:text-2xl print:text-lg">
            University of Bonn
          </h3>
          <p className="text-gray-700 print:text-black">
            Magister Artium in German Literature and Linguistics
          </p>
          <p className="text-gray-700 print:text-black">2005–2011</p>
        </div>
      </div>
    </CVSection>
  )
}
