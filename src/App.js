/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { amber, common } from '@material-ui/core/colors';
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
  contactFormWithUseFieldHookMuiCodeString,
} from './Components';

import { Section } from './Components/Section';
import { ExampleOne } from './Pages';

const App = () => (
  <Router>
    <div className="App">
      <AppBar
        position="static"
        style={{ backgroundColor: amber[300], color: common.black }}
      >
        <Tabs
          variant="fullWidth"
          // // value={value}
          // onChange={handleChange}
          aria-label="nav tabs example"
        >
          <Tab
            to="/ExampleOne"
            value="/ExampleOne"
            component={Link}
            label="Example 1: Boilerplate"
          />
        </Tabs>
      </AppBar>
      <Switch>
        <Route path="/ExampleOne">
          <ExampleOne />
        </Route>
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
          codeString={contactFormWithUseFieldHookMuiCodeString}
        />
      </Switch>
    </div>
  </Router>
);

export default App;
