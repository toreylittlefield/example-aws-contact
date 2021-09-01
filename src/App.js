import './App.css';
import ContactForm, { contactFormCodeString } from './Components/ContactForm';
import ContactFormReactContext, {
  contactFormReactContextCodeString,
} from './Components/ContactFormReactContext';
import ContactFormWithFieldProps from './Components/ContactFormWithFieldProps';
import ContactFormWithUseFieldHook from './Components/ContactFormWithUseFieldHook';
import ReactCodeBlock from './Components/ReactCodeBlock';
import React from 'react';

const App = () => {
  return (
    <div className="App">
      <section>
        <div className="container">
          <h2>Formik Example With Yup</h2>
          <p>All the boilerplate stuff</p>
          <ContactForm />
        </div>
        <ReactCodeBlock code={contactFormCodeString} />
      </section>
      <section>
        <div className="container">
          <h2>Formik With Field Props</h2>
          <p>Reduces boilerplate</p>
        </div>
        <ContactFormWithFieldProps />
      </section>
      <section>
        <div className="container">
          <h2>Formik React Context</h2>
          <p>Uses React Context / FormikContext</p>
          <ContactFormReactContext />
        </div>
        <ReactCodeBlock code={contactFormReactContextCodeString} />
      </section>
      <section>
        <div className="container">
          <h2>Formik useField Hook Example</h2>
          <p>Uses form useField hook for abstraction</p>
        </div>
        <ContactFormWithUseFieldHook />
      </section>
    </div>
  );
};

export default App;
