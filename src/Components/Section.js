import React from 'react';
import { ReactCodeBlock } from '.';

export const Section = ({
  sectionTitle = '',
  sectionDescription = '',
  ComponentToRender = {},
  codeString = '',
  id = '',
}) => (
  <section id={id} className="page">
    <div className="container">
      <h2>{sectionTitle}</h2>
      <p>{sectionDescription}</p>
      <ComponentToRender />
    </div>
    <ReactCodeBlock code={codeString} />
  </section>
);
