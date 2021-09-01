import './App.css';
import {
  ContactForm,
  contactFormCodeString,
  ContactFormReactContext,
  contactFormReactContextCodeString,
  ContactFormWithFieldProps,
  contactFormWithFieldPropsCodeString,
  ContactFormWithUseFieldHook,
  ContactFormWithUseFieldHookCodeString,
  ContactFormWithUseFieldHookMui,
  Section,
} from './Components';

const App = () => {
  return (
    <div className="App">
      <Section
        sectionTitle="Formik Example With Yup"
        sectionDescription="All the formik boilerplate stuff example"
        ComponentToRender={ContactForm}
        codeString={contactFormCodeString}
      />
      <Section
        sectionTitle="Formik With Field Props"
        sectionDescription="Example reduces some of the boilerplate from the above example using field props"
        ComponentToRender={ContactFormWithFieldProps}
        codeString={contactFormWithFieldPropsCodeString}
      />
      <Section
        sectionTitle="Formik React Context"
        sectionDescription="Formik basically uses the React Context which even further abstracts"
        ComponentToRender={ContactFormReactContext}
        codeString={contactFormReactContextCodeString}
      />
      <Section
        sectionTitle="Formik useField Hook Example"
        sectionDescription="Uses formik custom useField hook for abstraction and allows us to create custom field components"
        ComponentToRender={ContactFormWithUseFieldHook}
        codeString={ContactFormWithUseFieldHookCodeString}
      />
      <Section
        sectionTitle="Formik useField Hook Example Extended With MUI Components"
        sectionDescription="Again extending the useField example and adding MUI components using the 'AS' prop from the formik Field Component"
        ComponentToRender={ContactFormWithUseFieldHookMui}
        // codeString={ContactFormWithUseFieldHookCodeString}
      />
    </div>
  );
};

export default App;
