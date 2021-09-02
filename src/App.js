/* eslint-disable no-unused-vars */
import './App.css';
// import SwipeableViews from 'react-swipeable-views';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
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
        <Route path="/ExampleOne" component={ExampleOne} />
        <Route path="/ExampleTwo" component={ExampleTwo} />
        <Route path="/ExampleThree" component={ExampleThree} />
        <Route path="/ExampleFour" component={ExampleFour} />
        <Route path="/ExampleFive" component={ExampleFive} />
        <Redirect from="*" to="/ExampleOne" />
      </Switch>
    </div>
  </Router>
);

export default App;
