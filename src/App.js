import { useState } from 'react';
import './App.css';
import SwipeableViews from 'react-swipeable-views';

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

const App = () => {
  const [viewIndex, setviewIndex] = useState(0);
  const handleChange = (event) => {
    const el =
      event.target.parentElement.getAttribute('dataindex') ??
      event.target.getAttribute('dataindex');
    setviewIndex(parseInt(el) ?? viewIndex + 1);
  };
  const handleChangeIndex = (index) => {
    setviewIndex(index);
  };
  return (
    <Router>
      <div className="App">
        <NavBar handleChange={handleChange} />
        <Switch>
          <SwipeableViews
            index={viewIndex}
            onChangeIndex={handleChangeIndex}
            // ref={innerRef}
          >
            <Route path="/ExampleOne" component={ExampleOne} />
            <Route path="/ExampleTwo" component={ExampleTwo} />
            <Route path="/ExampleThree" component={ExampleThree} />
            <Route path="/ExampleFour" component={ExampleFour} />
            <Route path="/ExampleFive" component={ExampleFive} />
          </SwipeableViews>
          <Redirect from="*" to="/ExampleOne" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
