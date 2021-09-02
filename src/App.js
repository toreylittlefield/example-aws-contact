/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  NavBar,
  ContactFormReactContext,
  contactFormReactContextCodeString,
  ContactFormWithUseFieldHook,
  ContactFormWithUseFieldHookCodeString,
  ContactFormWithUseFieldHookMui,
  contactFormWithUseFieldHookMuiCodeString,
} from './Components';

import { Section } from './Components/Section';
import { ExampleOne, ExampleTwo, ExampleThree } from './Pages';

const App = () => (
  <Router>
    <div className="App">
      <NavBar />
      <Switch>
        <Route path="/ExampleOne">
          <ExampleOne />
        </Route>
        <Route path="/ExampleTwo">
          <ExampleTwo />
        </Route>
        <Route path="/ExampleThree">
          <ExampleThree />
        </Route>

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
          codeString={contactFormWithUseFieldHookMuiCodeString}
        />
      </Switch>
    </div>
  </Router>
);

export default App;
