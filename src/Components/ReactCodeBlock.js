// using the atomOneDark theme
// import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import PrismAsync from 'react-syntax-highlighter/dist/esm/prism-async';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism/';
// };
//   <CopyBlock
//     text={code}
//     language="jsx"
//     showLineNumbers
//     theme={dracula}
//     wrapLines={true}
//     startingLineNumber={1}
//   />
const ReactCodeBlock = ({ code }) => (
  <PrismAsync language="javascript" style={darcula}>
    {code}
  </PrismAsync>
);

export default ReactCodeBlock;
