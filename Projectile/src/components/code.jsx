import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
function Code(props){
  const codeString = '(num) => num + 1 ';
  return (
    <SyntaxHighlighter language="jsx" style={atomDark}>
      {codeString}
    </SyntaxHighlighter>
  );
};

export default Code;