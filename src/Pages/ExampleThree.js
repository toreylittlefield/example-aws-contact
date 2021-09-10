import React from 'react';
import {
  ContactFormReactContext,
  contactFormReactContextCodeString,
} from '../Components';
import { Section } from '../Components/Section';

const ExampleThree = () => (
  <Section
    id="example-three"
    sectionTitle="Formik React Context"
    sectionDescription="Formik basically uses the React Context which even further abstracts"
    ComponentToRender={ContactFormReactContext}
    codeString={contactFormReactContextCodeString}
  />
);

export default ExampleThree;
