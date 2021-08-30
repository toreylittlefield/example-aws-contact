import './App.css';
import ContactForm from './Components/ContactForm';
import ContactFormReactContext from './Components/ContactFormReactContext';
import ContactFormWithFieldProps from './Components/ContactFormWithFieldProps';

const App = () => (
  <div className="App">
    <section>
      <h2>Formik Example With Yup</h2>
      <p>All the boilerplate stuff</p>
      <ContactForm />
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
  </div>
);

export default App;
