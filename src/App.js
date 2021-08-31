import './App.css';
import ContactForm, { contactFormCodeString } from './Components/ContactForm';
import ContactFormReactContext from './Components/ContactFormReactContext';
import ContactFormWithFieldProps from './Components/ContactFormWithFieldProps';
import ContactFormWithUseFieldHook from './Components/ContactFormWithUseFieldHook';
import ReactCodeBlock from './Components/ReactCodeBlock';
import React from 'react';

const App = () => {
  return (
    <div className="App">
      <section>
        <h2>Formik Example With Yup</h2>
        <p>All the boilerplate stuff</p>
        <ContactForm />
        <ReactCodeBlock code={contactFormCodeString} />
      </section>
      <section>
        <h2>Formik With Field Props</h2>
        <p>Reduces boilerplate</p>
        <ContactFormWithFieldProps />
      </section>
      <section>
        <h2>Formik React Context</h2>
        <p>Uses React Context / FormikContext</p>
        <ContactFormReactContext />
      </section>
      <section>
        <h2>Formik useField Hook Example</h2>
        <p>Uses form useField hook for abstraction</p>
        <ContactFormWithUseFieldHook />
      </section>
    </div>
  );
};

export default App;
