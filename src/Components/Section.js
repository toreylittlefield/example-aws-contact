import React from 'react';
import { ReactCodeBlock } from '.';

export const Section = ({
  sectionTitle = '',
  sectionDescription = '',
  ComponentToRender = {},
  codeString = '',
}) => (
  <section>
    <div className="container">
      <h2>{sectionTitle}</h2>
      <p>{sectionDescription}</p>
      <ComponentToRender />
    </div>
    <ReactCodeBlock code={codeString} />
  </section>
);
