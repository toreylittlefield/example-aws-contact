import { useState } from 'react';
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

const routes = [
  {
    path: '/ExampleOne',
    component: ExampleOne,
  },
  {
    path: '/ExampleTwo',
    component: ExampleTwo,
  },
  {
    path: '/ExampleThree',
    component: ExampleThree,
  },
  {
    path: '/ExampleFour',
    component: ExampleFour,
  },
  {
    path: '/ExampleFive',
    component: ExampleFive,
  },
];

const App = () => {
  const history = useHistory();
  const initialState = () => {
    const pathOnLoad = history.location.pathname;
    const initIndex = routes.findIndex((route) => route.path === pathOnLoad);
    return initIndex !== -1 ? initIndex : 0;
  };
  const [viewIndex, setviewIndex] = useState(initialState());
  const handleChange = (event) => {
    const el =
      event.target.parentElement.getAttribute('dataindex') ??
      event.target.getAttribute('dataindex');
    setviewIndex(parseInt(el) ?? viewIndex + 1);
  };
  const handleChangeIndex = (index) => {
    const pathTo = routes[index].path;
    setviewIndex(index);
    history.push(pathTo);
  };
  return (
    <div className="App">
      <NavBar handleChange={handleChange} />
      <Switch>
        <SwipeableViews
          index={viewIndex}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents
        >
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
          <Redirect from="*" to="/ExampleOne" />
        </SwipeableViews>
      </Switch>
    </div>
  );
};

export default App;
