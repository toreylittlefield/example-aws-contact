import React from 'react';
import {
  ContactFormWithUseFieldHook,
  ContactFormWithUseFieldHookCodeString,
} from '../Components';
import { Section } from '../Components/Section';

const ExampleFour = () => (
  <Section
    id="example-four"
    sectionTitle="Formik useField Hook Example"
    sectionDescription="Uses formik custom useField hook for abstraction and allows us to create custom field components"
    ComponentToRender={ContactFormWithUseFieldHook}
    codeString={ContactFormWithUseFieldHookCodeString}
  />
);

export default ExampleFour;
