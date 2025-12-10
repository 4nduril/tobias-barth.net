import { ReactNode } from 'react'

export const CVSection = ({
  children,
  title,
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <section className="mb-10 print:mb-6">
      <h2 className="font-display text-3xl text-primary mb-6 print:text-black print:text-2xl print:mb-4">
        {title}
      </h2>
      {children}
    </section>
  )
}
