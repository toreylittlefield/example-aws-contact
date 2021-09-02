import React from 'react';
import { ContactForm, contactFormCodeString } from '../Components';
import { Section } from '../Components/Section';

const ExampleOne = () => (
  <Section
    sectionTitle="Formik Example With Yup"
    sectionDescription="All the formik boilerplate stuff example"
    ComponentToRender={ContactForm}
    codeString={contactFormCodeString}
  />
);

export default ExampleOne;
