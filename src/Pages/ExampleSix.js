import React from 'react';
import { LiveFormMUI, LiveFormMUICodeString } from '../Components';
import { Section } from '../Components/Section';

const ExampleSix = () => (
  <Section
    id="example-six"
    sectionTitle="Formik MUI with fetch hook to call aws gateway"
    sectionDescription="Live example to send our form values to AWS Gateway and validate recaptcha"
    ComponentToRender={LiveFormMUI}
    codeString={LiveFormMUICodeString}
  />
);

export default ExampleSix;
