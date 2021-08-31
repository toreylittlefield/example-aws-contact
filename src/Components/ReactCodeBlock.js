import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism/';
import * as beautify from 'js-beautify';
import { IconButton, Tooltip } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';

const options = {
  indent_size: '1',
  indent_char: '\t',
  max_preserve_newlines: '5',
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: true,
  indent_scripts: 'separate',
  brace_style: 'collapse,preserve-inline',
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: true,
  wrap_line_length: '120',
  indent_inner_html: false,
  comma_first: true,
  e4x: true,
  indent_empty_lines: false,
};

const ReactCodeBlock = ({ code }) => {
  const handleCopy = () => {
    window.navigator.clipboard.writeText(code);
  };
  return (
    <div style={{ position: 'relative' }}>
      <Tooltip title="Copy Snippet" style={{ position: 'absolute', right: 0, top: 0, color: 'white' }}>
        <IconButton onClick={handleCopy}>
          <FileCopy />
        </IconButton>
      </Tooltip>
      <SyntaxHighlighter
        language="jsx"
        showLineNumbers
        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
        wrapLines={true}
        style={darcula}
        customStyle={{ margin: 0, padding: 0 }}
        children={beautify(code, options)}
      />
    </div>
  );
};

export default ReactCodeBlock;
