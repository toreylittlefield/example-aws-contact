import { useState, useEffect, useMemo } from 'react';
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

import { CustomSwiper, NavBar, IntroAnimation } from './Components';

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
  const [viewpathIndex, setviewpathIndex] = useState(null);
  const [gsapTimingState, setGsapTimingState] = useState(initGsapTiming);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesMemo = useMemo(() => matches, [matches]);

  const initialState = () => {
    const pathOnLoad = history.location.pathname;
    const initpathIndex = routes.findIndex(
      (route) => route.path === pathOnLoad
    );
    return initpathIndex === -1 ? 0 : initpathIndex;
  };

  useEffect(() => {
    if (viewpathIndex === null) setviewpathIndex(initialState);
  }, []);

  useEffect(() => {
    if (history.action === 'POP') {
      setviewpathIndex(initialState);
    }
    document
      .querySelectorAll('iframe[title="recaptcha challenge"]', '.page')
      ?.forEach((element, pathIndex) => {
        if (pathIndex === 0) return;
        if (element.tagName === 'IFRAME')
          return element.parentElement.parentElement.remove();
      });
  }, [location]);

  const handleChange = (event) => {
    const el =
      event.target.parentElement.getAttribute('datapathIndex') ??
      event.target.getAttribute('datapathIndex');
    setviewpathIndex(parseInt(el) ?? viewpathIndex + 1);
  };

  // const handleChangepathIndex = (pathIndex) => {
  //   if (pathIndex >= routes.length) return;
  //   const pathTo = routes[pathIndex].path;
  //   setviewpathIndex(pathIndex);
  //   history.push(pathTo);
  // };
  const [reverseAnimation, setReverseAnimation] = useState(false);
  const [prevElements, setPrevElements] = useState({
    exitEl: null,
    enterEl: null,
    wrapper: null,
  });

  const moveGsap = matchesMemo ? 'xPercent' : 'yPercent';

  // page transitions animation with gsap
  useEffect(() => {
    if (prevElements.enterEl === null) return;

    const tl = gsap.timeline({
      autoRemoveChildren: true,
      defaults: { overwrite: 'auto' },
    });
    const wrapper = async () => {
      const runExitAni = () => {
        if (prevElements.exitEl === null) return;
        const { elementsToAnimate, node, firstChild, secondChild } =
          prevElements.exitEl;
        const [pageWrapper, curtain] = prevElements.wrapper;
        if (reverseAnimation) {
          gsap.set(node, { display: 'none' });
          tl.add(
            enterAnimation(
              node,
              firstChild,
              secondChild,
              tl,
              moveGsap,
              gsapTimingState
            ).reverse()
          ).addLabel('exit', '<');
          tl.add(wrapperAnimation(pageWrapper, curtain).reverse()).addLabel(
            'wrapper',
            '<'
          );
        } else {
          tl.add(
            exitAnimation(elementsToAnimate, gsapTimingState, moveGsap)
          ).addLabel('exit', '<');
          tl.add(wrapperAnimation(pageWrapper, curtain), '<0.3').addLabel(
            'wrapper',
            '<'
          );
        }
        // set the totalTime duration of the animation
        if (gsapTimingState.totalTime === 0) {
          setGsapTimingState((prev) => {
            const copyState = prev;
            copyState.totalTime = tl.duration();
            return copyState;
          });
        }
      };
      const runEnterAni = () => {
        if (prevElements.enterEl === null) return;
        const { elementsToAnimate, firstChild, secondChild, node } =
          prevElements.enterEl;
        if (reverseAnimation) {
          tl.add(
            exitAnimation(
              elementsToAnimate,
              gsapTimingState,
              moveGsap,
              true,
              node
            ).addLabel('enter', '<')
          );
        } else {
          tl.add(
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
      };
      await runExitAni();
      runEnterAni();
    };
    wrapper();

    return () => {
      if (tl) {
        if (prevElements.exitEl === null) return;

        tl.reversed(true).then(() => tl.kill());
      }
    };
  }, [reverseAnimation]);

  // exiting element
  const onExit = (node) => {
    if (!node) return;
    const [firstChild, secondChild] = node.children;
    const pageWrapper = '.page-wrapper';
    const curtain = '.curtain';
    const elementsToAnimate = !matchesMemo
      ? [firstChild, secondChild.children]
      : [firstChild.children, secondChild, secondChild.children];
    setPrevElements((prev) => {
      const copy = prev;
      copy.exitEl = { elementsToAnimate, node, firstChild, secondChild };
      copy.wrapper = [pageWrapper, curtain];
      return copy;
    });
  };

  // entering element (called after exited element)
  const onEnter = (node) => {
    if (!node) return;
    gsap.set(node, { display: 'none' });
    const [firstChild, secondChild] = node.children;
    const elementsToAnimate = !matchesMemo
      ? [firstChild, secondChild.children]
      : [firstChild.children, secondChild, secondChild.children];
    setPrevElements((prev) => {
      const copy = prev;
      copy.enterEl = { elementsToAnimate, firstChild, secondChild, node };
      return copy;
    });
    setReverseAnimation((prev) => !prev);
  };

  return (
    <div className="App">
      <IntroAnimation />
      <NavBar handleChange={handleChange} />
      <div className="page-wrapper">
        <div className="curtain" />
        <div className="curtain" />
        <div className="curtain" />
      </div>
      <CustomSwiper routes={routes} history={history} location={location}>
        {routes.map(({ path, component: Component, key }) => (
          <Route key={key} path={path} exact>
            {({ match }) => (
              <Transition
                in={match !== null}
                timeout={gsapTimingState.totalTime * 250 ?? 4300}
                onExit={onExit}
                onEnter={onEnter}
                unmountOnExit
              >
                <Component to={path === '*' ? '/ExampleOne' : null} />
              </Transition>
            )}
          </Route>
        ))}
      </CustomSwiper>
    </div>
  );
};

export default App;
