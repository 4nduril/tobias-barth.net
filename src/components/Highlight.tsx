import React, { FC } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

interface HighlightProps {
  language: string
  value: string
}
const Highlight: FC<HighlightProps> = ({ value, language }) => (
  <div className="mb-7">
    <SyntaxHighlighter language={language} customStyle={{ margin: '0' }}>
      {value}
    </SyntaxHighlighter>
  </div>
)

export default Highlight
