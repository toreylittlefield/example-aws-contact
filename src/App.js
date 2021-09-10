import { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import { Transition } from 'react-transition-group';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { Route, Redirect, useHistory, useLocation } from 'react-router-dom';

import {
  CustomSwiper,
  NavBar,
  IntroAnimation,
  PageWrapper,
} from './Components';

import {
  ExampleOne,
  ExampleTwo,
  ExampleThree,
  ExampleFour,
  ExampleFive,
} from './Pages';
import { useRecaptchaCleanup } from './Hooks';
import { usePageTransitions } from './Hooks/usePageTransitions';

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

const App = () => {
  const history = useHistory();
  const location = useLocation();
  useRecaptchaCleanup(location);
  const [viewpathIndex, setviewpathIndex] = useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesMemo = useMemo(() => matches, [matches]);

  const getRouterPathIndex = useCallback(() => {
    const pathOnLoad = history.location.pathname;
    const initpathIndex = routes.findIndex(
      (route) => route.path === pathOnLoad
    );
    return initpathIndex === -1 ? 0 : initpathIndex;
  }, []);

  useEffect(() => {
    if (viewpathIndex === null) setviewpathIndex(getRouterPathIndex);
    if (history.action === 'POP') {
      setviewpathIndex(getRouterPathIndex);
    }
  }, [location]);

  const handleChange = (event) => {
    const el =
      event.target.parentElement.getAttribute('datapathIndex') ??
      event.target.getAttribute('datapathIndex');
    setviewpathIndex(parseInt(el) ?? viewpathIndex + 1);
  };

  const [prevElements, setPrevElements] = useState({
    exitEl: null,
    enterEl: null,
    wrapper: null,
  });

  const moveGsap = matchesMemo ? 'xPercent' : 'yPercent';
  const [reverseAnimation, setReverseAnimation] = useState(false);

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
    const copyNode = node;
    copyNode.style.display = 'none';
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

  const [gsapTimingState] = usePageTransitions(
    prevElements,
    reverseAnimation,
    moveGsap
  );

  return (
    <div className="App">
      <IntroAnimation />
      <PageWrapper />
      <NavBar handleChange={handleChange} />
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
