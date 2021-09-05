/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import { Transition } from 'react-transition-group';
import { gsap } from 'gsap';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import {
  enterAnimation,
  exitAnimation,
  wrapperAnimation,
} from './Animations/pageTransitions';

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
    key: 'ExampleOne',
    exact: true,
  },
  {
    path: '/ExampleTwo',
    component: ExampleTwo,
    key: 'ExampleTwo',
    exact: true,
  },
  {
    path: '/ExampleThree',
    component: ExampleThree,
    key: 'ExampleThree',
    exact: true,
  },
  {
    path: '/ExampleFour',
    component: ExampleFour,
    key: 'ExampleFour',
    exact: true,
  },
  {
    path: '/ExampleFive',
    component: ExampleFive,
    key: 'ExampleFive',
    exact: true,
  },
  {
    path: '*',
    component: Redirect,
    key: 'router-redirect-key',
    exact: false,
  },
];

/**
 * @description exit occurs first in the transition
 */
const initGsapTiming = {
  duration: 0.6,
  stagger: 0.6,
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
  const exitRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    tl.current = gsap.timeline({ defaults: { paused: true, yoyo: true } });
  }, []);

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
    document
      .querySelectorAll('iframe[title="recaptcha challenge"]', '.page')
      ?.forEach((element, index) => {
        if (index === 0) return;
        if (element.tagName === 'IFRAME')
          return element.parentElement.parentElement.remove();
      });
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
  const [reverseAnimation, setReverseAnimation] = useState(false);

  const moveGsap = matchesMemo ? 'xPercent' : 'yPercent';

  const onEnter = (node) => {
    console.log('enter', gsapTimingState);
    // console.log({ refEnter: exitRef.current });
    if (!node) return;
    const [firstChild, secondChild] = node.children;
    const elementsToAnimate = !matchesMemo
      ? [firstChild, secondChild.children]
      : [firstChild.children, secondChild, secondChild.children];

    if (reverseAnimation) {
      tl.current
        .add(exitAnimation(elementsToAnimate, gsapTimingState, moveGsap, true))
        .addLabel('enter', '<');
    } else {
      tl.current.add(
        enterAnimation(
          node,
          firstChild,
          secondChild,
          tl,
          moveGsap,
          gsapTimingState
        ).addLabel('enter', '<')
      );
    }
    setReverseAnimation((prev) => !prev);
  };

  const onExit = (node) => {
    // console.log({ refExit: exitRef.current, tl });
    if (!node) return;

    const [firstChild, secondChild] = node.children;
    const pageWrapper = '.page-wrapper';
    const curtain = '.curtain';
    const elementsToAnimate = !matchesMemo
      ? [firstChild, secondChild.children]
      : [firstChild.children, secondChild, secondChild.children];

    if (reverseAnimation) {
      gsap.set(node, { display: 'none' });
      tl.current
        .add(
          enterAnimation(
            node,
            firstChild,
            secondChild,
            tl,
            moveGsap,
            gsapTimingState
          ).reverse()
        )
        .addLabel('exit', '<');
      tl.current
        .add(wrapperAnimation(pageWrapper, curtain).reverse())
        .addLabel('wrapper', '<');
    } else {
      tl.current
        .add(exitAnimation(elementsToAnimate, gsapTimingState, moveGsap))
        .addLabel('exit', '<');
      tl.current
        .add(wrapperAnimation(pageWrapper, curtain), '<0.3')
        .addLabel('wrapper', '<');
    }
    console.log({ iteration: tl.current.iteration() });

    // set the totalTime duration of the animation
    if (gsapTimingState.totalTime === 0) {
      setGsapTimingState((prev) => {
        const copyState = prev;
        copyState.totalTime = tl.current.duration();
        return copyState;
      });
    }
  };

  return (
    <div className="App">
      <NavBar handleChange={handleChange} />
      <div className="page-wrapper">
        <div className="curtain" />
        <div className="curtain" />
        <div className="curtain" />
      </div>
      {routes.map(({ path, component: Component, key, exact }) => (
        <Route key={key} path={path} exact>
          {({ match }) => (
            <Transition
              in={match !== null}
              timeout={gsapTimingState.totalTime * 950 ?? 0}
              onExit={onExit}
              onEntering={onEnter}
              unmountOnExit
              ref={exitRef}
            >
              <Component to={path === '*' ? '/ExampleOne' : null} />
            </Transition>
          )}
        </Route>
      ))}
    </div>
  );
};

export default App;
