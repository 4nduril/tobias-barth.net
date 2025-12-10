export const CVTextContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-3 print:text-justify print:hyphens-auto print:space-y-2 print:text-sm">
      {children}
    </div>
  )
}
