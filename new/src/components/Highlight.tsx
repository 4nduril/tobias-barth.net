import React, { FC } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface HighlightProps {
  language: string;
  value: string;
}
const Highlight: FC<HighlightProps> = ({ value, language }) => (
  <div className="pre-wrapper">
    <SyntaxHighlighter language={language} customStyle={{ margin: "0" }}>
      {value}
    </SyntaxHighlighter>
    <style jsx>{`
      .pre-wrapper {
        margin-bottom: ${1.125 * 1.4444}rem;
      }
      @media screen and (min-width: 65em) {
        .pre-wrapper {
          margin-bottom: ${1.111 * 1.125 * 1.4444}rem;
        }
      }
    `}</style>
  </div>
);

export default Highlight;
