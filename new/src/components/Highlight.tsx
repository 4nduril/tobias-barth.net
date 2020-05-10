import React, {FC} from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

interface HighlightProps {
	language: string
	value: string
}
const Highlight: FC<HighlightProps> = ({value, language}) => (
	<SyntaxHighlighter language={language}>
		{value}
	</SyntaxHighlighter>
)

export default Highlight
