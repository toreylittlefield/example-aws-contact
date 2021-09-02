/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { NavBar } from './Components';

import {
  ExampleOne,
  ExampleTwo,
  ExampleThree,
  ExampleFour,
  ExampleFive,
} from './Pages';

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
        <Route path="/ExampleFour">
          <ExampleFour />
        </Route>
        <Route path="/ExampleFive">
          <ExampleFive />
        </Route>
      </Switch>
    </div>
  </Router>
);

export default App;
