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
    tl.current = gsap.timeline();
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
  const [transitionIn, setTransitionIn] = useState(true);

  const moveGsap = matchesMemo ? 'xPercent' : 'yPercent';

  const onEnter = (node) => {
    console.log('enter', gsapTimingState);
    console.log({ refEnter: exitRef.current });
    if (!node) return;
    // if (tl.current && tl.current.isActive()) return;

    // gsap.killTweensOf(node);
    gsap.set(node, { display: 'none' });
    const [firstChild, secondChild] = node.children;
    gsap.set(document.body, { overflow: 'hidden' });

    tl.current.from([firstChild.children, secondChild, secondChild.children], {
      onStart: () => gsap.set(node, { clearProps: 'display' }),
      onComplete: () => {
        gsap.set(document.body, { clearProps: 'overflow' });
        tl.current.totalProgress(1).clear();
      },
      ease: 'power3.Out',
      // delay: gsapTimingState.totalTime + 0.05,
      autoAlpha: 0,
      [moveGsap]: 10,
      stagger: {
        amount: gsapTimingState.stagger,
      },
      duration: gsapTimingState.duration,
    });
  };

  const onExit = (node) => {
    console.log({ refExit: exitRef.current, tl });
    if (!node) return;
    if (tl.current && tl.current.isActive()) return;
    // gsap.killTweensOf(node);
    const tline = gsap.timeline();
    // tline.autoRemoveChildren();

    const [firstChild, secondChild] = node.children;
    gsap.set(document.body, { overflow: 'hidden' });
    console.log({ matchesMemo });
    const elementsToAnimate = !matchesMemo
      ? [firstChild, secondChild.children]
      : [firstChild.children, secondChild, secondChild.children];
    const exitAnimation = tl.current.to(elementsToAnimate, {
      ease: 'power3.In',
      duration: gsapTimingState.duration,
      [moveGsap]: -100,
      autoAlpha: 0,
      stagger: {
        amount: gsapTimingState.stagger,
      },
    });
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
      {/* <TransitionGroup> */}
      {/* 
      <Transition
          in={transitionIn}
          timeout={gsapTimingState.totalTime + 0.02}
          onExit={onExit}
          onEntering={onEnter}
          unmountOnExit
          ref={exitRef}
          key={location.key}
        >
          <Switch location={location}> */}
      {routes.map(({ path, component: Component, key, exact }) => (
        <Route key={key} path={path} exact>
          {
            ({ match }) => (
              // match !== null ? (
              <Transition
                in={match !== null}
                timeout={gsapTimingState.totalTime * 950 ?? 0}
                onExit={onExit}
                onEntering={onEnter}
                unmountOnExit
                ref={exitRef}
                // key={location.key
              >
                <Component to={path === '*' ? '/ExampleOne' : null} />
              </Transition>
            )
            // ) : null
          }
        </Route>
      ))}
      {/* </Switch>
        </Transition>
      </TransitionGroup> */}
    </div>
  );
};

export default App;
