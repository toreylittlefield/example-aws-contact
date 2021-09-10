import React from 'react';
import {
  ContactFormWithUseFieldHookMui,
  contactFormWithUseFieldHookMuiCodeString,
} from '../Components';
import { Section } from '../Components/Section';

const ExampleFive = () => (
  <Section
    id="example-five"
    sectionTitle="Formik useField Hook Example Extended With MUI Components"
    sectionDescription="Again extending the useField example and adding MUI components using the 'AS' prop from the formik Field Component"
    ComponentToRender={ContactFormWithUseFieldHookMui}
    codeString={contactFormWithUseFieldHookMuiCodeString}
  />
);

export default ExampleFive;
