import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism/';
import * as beautify from 'js-beautify';
import { IconButton, Tooltip, Collapse, Card, CardActions, CardContent } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { FileCopy, ExpandMoreTwoTone, ExpandLessTwoTone } from '@material-ui/icons';

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
  const [open, setOpen] = useState(false);
  const handleCopy = () => {
    window.navigator.clipboard.writeText(code);
  };
  const handleOpen = () => setOpen((prev) => !prev);
  return (
    <Card>
      <CardContent>
        <CardActions disableSpacing style={{ padding: '0', position: 'relative' }}>
          <div style={{ display: 'flex', position: 'absolute', right: 0, top: 0, padding: '0.1em 2em' }}>
            <Tooltip title="Copy Snippet" style={{ color: 'white' }}>
              <IconButton onClick={handleCopy}>
                <FileCopy />
              </IconButton>
            </Tooltip>
            <Tooltip
              color={open ? 'secondary' : ''}
              style={!open ? { color: green[500] } : {}}
              title={open ? `Collapse Snippet` : `Expand Snippet`}
            >
              <IconButton>
                {open ? (
                  <ExpandLessTwoTone color={'secondary'} onClick={handleOpen} />
                ) : (
                  <ExpandMoreTwoTone style={{ color: green[500] }} onClick={handleOpen} />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </CardActions>
        <Collapse collapsedSize="200px" in={open} timeout="auto" style={open ? '' : { overflowY: 'scroll' }}>
          <SyntaxHighlighter
            language="jsx"
            showLineNumbers={true}
            showInlineLineNumbers={true} // <-- add this prop!
            wrapLines={true}
            customStyle={{
              margin: 0,
              padding: '0.25em',
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
              boxShadow: '0px 2px 4px rgba(50,50,93,.1)',
            }}
            style={darcula}
            children={beautify(code, options)}
          />
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ReactCodeBlock;
