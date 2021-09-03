/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import './App.css';
import { Transition, TransitionGroup } from 'react-transition-group';
import { gsap } from 'gsap';

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
  // const handleChangeIndex = (index) => {
  //   if (index >= routes.length) return;
  //   const pathTo = routes[index].path;
  //   setviewIndex(index);
  //   history.push(pathTo);
  // };
  const [transitionIn, setTransitionIn] = useState(true);

  const onEnter = (node) => {
    if (!node) return;
    gsap.set(document.body, { overflow: 'hidden' });
    gsap.set(node, { display: 'none' });
    gsap.from([node.children], {
      onStart: () => gsap.set(node, { display: '' }),
      xPercent: 10,
      delay: 1.5,
      ease: 'power3.Out',
      autoAlpha: 0,
      stagger: {
        amount: 0.6,
      },
      duration: 0.6,
    });
  };

  const onExit = (node) => {
    if (!node) return;
    gsap.to([node.children], {
      xPercent: -10,
      ease: 'power3.In',
      stagger: {
        amount: 0.2,
      },
      duration: 0.6,
      autoAlpha: 0,
      onStart: () => setTransitionIn(false),
      onComplete: () => {
        setTransitionIn(true);
        gsap.set(node, { display: 'none' });
      },
    });
  };
  return (
    <div className="App">
      <NavBar handleChange={handleChange} />
      <TransitionGroup>
        <Transition
          in={transitionIn}
          timeout={1200}
          onExit={onExit}
          onEnter={onEnter}
          unmountOnExit
          key={location.key}
        >
          <Switch location={location}>
            {routes.map(({ path, component: Component }) => (
              <Route key={path} exact path={path} component={Component} />
            ))}

            <Route path="*">
              <Redirect to="/ExampleOne" />
            </Route>
          </Switch>
        </Transition>
      </TransitionGroup>
    </div>
  );
};

export default App;
