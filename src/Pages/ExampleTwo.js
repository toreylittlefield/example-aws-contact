import React from 'react';
import {
  ContactFormWithFieldProps,
  contactFormWithFieldPropsCodeString,
} from '../Components';
import { Section } from '../Components/Section';

const ExampleTwo = () => (
  <Section
    id="example-two"
    sectionTitle="Formik With Field Props"
    sectionDescription="Example reduces some of the boilerplate from the above example using field props"
    ComponentToRender={ContactFormWithFieldProps}
    codeString={contactFormWithFieldPropsCodeString}
  />
);

export default ExampleTwo;
