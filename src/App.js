import { useState, useRef } from 'react';
import './App.css';
import SwipeableViews from 'react-swipeable-views';

import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { NavBar } from './Components';

import {
  ExampleOne,
  ExampleTwo,
  ExampleThree,
  ExampleFour,
  ExampleFive,
} from './Pages';

const App = () => {
  const history = useHistory();
  const swipeRef = useRef(null);
  const [viewIndex, setviewIndex] = useState(0);
  const handleChange = (event) => {
    const el =
      event.target.parentElement.getAttribute('dataindex') ??
      event.target.getAttribute('dataindex');
    setviewIndex(parseInt(el) ?? viewIndex + 1);
  };
  const handleChangeIndex = (index) => {
    if (!swipeRef.current) return;
    const pathTo = swipeRef.current.props.children[index].props.path;
    setviewIndex(index);
    history.push(pathTo);
  };
  return (
    <div className="App">
      <NavBar handleChange={handleChange} />
      <Switch>
        <SwipeableViews
          ref={swipeRef}
          index={viewIndex}
          onChangeIndex={handleChangeIndex}
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
  );
};

export default App;
