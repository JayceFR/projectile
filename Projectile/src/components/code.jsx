import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
function Code(props){
  const codeString = props.code;
  return (
    <SyntaxHighlighter language="jsx" style={atomDark} wrapLongLines={false} customStyle = {{padding:"25px"}}>
      {codeString}
    </SyntaxHighlighter>
  );
};

export default Code;