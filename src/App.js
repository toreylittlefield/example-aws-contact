import { useState, useEffect } from 'react';
import './App.css';
import SwipeableViews from 'react-swipeable-views';

import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
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
  const location = useLocation();
  const [viewIndex, setviewIndex] = useState(null);

  const initialState = () => {
    const pathOnLoad = history.location.pathname;
    const initIndex = routes.findIndex((route) => route.path === pathOnLoad);
    return initIndex === -1 ? 0 : initIndex;
  };

  useEffect(() => {
    setviewIndex(initialState);
  }, []);

  useEffect(() => {
    if (history.action === 'POP') {
      setviewIndex(initialState);
    }
  }, [location]);

  const handleChange = (event) => {
    const el =
      event.target.parentElement.getAttribute('dataindex') ??
      event.target.getAttribute('dataindex');
    setviewIndex(parseInt(el) ?? viewIndex + 1);
  };
  const handleChangeIndex = (index) => {
    if (index >= routes.length) return;
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
          disableLazyLoading
        >
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </SwipeableViews>
        <Route path="*">
          <Redirect to="/ExampleOne" />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
