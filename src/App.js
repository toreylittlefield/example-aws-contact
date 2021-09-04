/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import { Transition, TransitionGroup } from 'react-transition-group';
import { gsap } from 'gsap';
import { useMediaQuery, useTheme } from '@material-ui/core';

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

/**
 * @description exit occurs first in the transition
 */
const initGsapTiming = {
  duration: 0.6,
  stagger: 0.3,
  totalTime: 0,
};

const App = () => {
  const history = useHistory();
  const location = useLocation();
  const [viewIndex, setviewIndex] = useState(null);
  const [gsapTimingState, setGsapTimingState] = useState(initGsapTiming);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesMemo = useMemo(() => matches, [matches]);
  const transitionRef = useRef(null);

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

  const moveGsap = matchesMemo ? 'xPercent' : 'yPercent';

  const onEnter = (node) => {
    console.log('enter', gsapTimingState);
    console.log({ refExit: transitionRef.current });
    if (!node) return;
    gsap.set(node, { display: 'none' });
    const [firstChild, secondChild] = node.children;

    gsap.from([firstChild.children, secondChild, secondChild.children], {
      onStart: () => gsap.set(node, { clearProps: 'display' }),
      onComplete: () => gsap.set(document.body, { clearProps: 'overflow' }),
      ease: 'power3.Out',
      delay: gsapTimingState.totalTime + 0.05,
      autoAlpha: 0,
      [moveGsap]: 10,
      stagger: {
        amount: gsapTimingState.stagger,
      },
      duration: gsapTimingState.duration,
    });
  };

  const onExit = (node) => {
    console.log({ refExit: transitionRef.current });
    if (!node) return;
    const [firstChild, secondChild] = node.children;
    gsap.set(document.body, { overflow: 'hidden' });
    const exitAnimation = gsap.to(
      [firstChild.children, secondChild, secondChild.children],
      {
        onStart: () => setTransitionIn(false),
        onComplete: () => {
          setTransitionIn(true);
          // gsap.set(node, { display: 'none' });
        },
        ease: 'power3.In',
        duration: gsapTimingState.duration,
        [moveGsap]: -30,
        autoAlpha: 0,
        stagger: {
          amount: gsapTimingState.stagger,
        },
      }
    );
    // set the totalTime duration of the animation
    if (gsapTimingState.totalTime === 0) {
      setGsapTimingState((prev) => {
        const copyState = prev;
        copyState.totalTime = exitAnimation.duration();
        return copyState;
      });
    }
  };
  return (
    <div className="App">
      <NavBar handleChange={handleChange} />
      <TransitionGroup>
        <Transition
          in={transitionIn}
          timeout={gsapTimingState.totalTime + 200}
          onExit={onExit}
          onEntering={onEnter}
          unmountOnExit
          ref={transitionRef}
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
