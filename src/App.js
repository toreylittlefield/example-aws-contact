/* eslint-disable no-unused-vars */
import { useMemo, useRef } from 'react';
import './App.css';
import { CSSTransition } from 'react-transition-group';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { Route, useHistory, useLocation } from 'react-router-dom';

import {
  CustomSwiper,
  NavBar,
  IntroAnimation,
  PageWrapper,
} from './Components';

import {
  useRecaptchaCleanup,
  usePageTransitions,
  useRouterPathIndex,
} from './Hooks';

import routes from './Routes/routes';

const App = () => {
  // router hooks
  const history = useHistory();
  const location = useLocation();

  // mui hooks
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  // refs to pass to our page transitions
  const prevElements = useRef({
    exitEl: null,
    enterEl: null,
    wrapper: null,
  });

  const matchesMemo = useMemo(() => matches, [matches]);
  const moveGsap = matchesMemo ? 'xPercent' : 'yPercent';
  // custom hooks
  useRecaptchaCleanup(location);
  const [viewPathIndex, setViewPathIndex] = useRouterPathIndex(routes, history);
  const [gsapTimingState, setReverseAnimation] = usePageTransitions(
    prevElements.current,
    moveGsap
  );

  const handleChange = (event) => {
    const el =
      event.target.parentElement.getAttribute('datapathIndex') ??
      event.target.getAttribute('datapathIndex');
    setViewPathIndex(parseInt(el) ?? viewPathIndex + 1);
  };

  // exiting element
  const onExit = (node) => {
    if (!node) return;
    const [firstChild, secondChild] = node.children;
    const pageWrapper = '.page-wrapper';
    const curtain = '.curtain';
    const elementsToAnimate = !matchesMemo
      ? [firstChild, secondChild.children]
      : [firstChild.children, secondChild, secondChild.children];
    prevElements.current.exitEl = {
      elementsToAnimate,
      node,
      firstChild,
      secondChild,
    };
    prevElements.current.wrapper = [pageWrapper, curtain];
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
    prevElements.current.enterEl = {
      elementsToAnimate,
      firstChild,
      secondChild,
      node,
    };
    setReverseAnimation((prev) => {
      if (prev === null) return false;
      return !prev;
    });
  };

  return (
    <div className="App">
      <IntroAnimation />
      <PageWrapper />
      <NavBar handleChange={handleChange} />
      <CustomSwiper routes={routes} history={history} location={location}>
        {routes.map(({ path, component: Component, key }) => (
          <Route key={key} path={path} exact>
            {({ match }) => {
              console.count('router rendering');
              return (
                <CSSTransition
                  location={location}
                  in={match !== null}
                  timeout={gsapTimingState.totalTime * 250 ?? 4300}
                  onExit={onExit}
                  onEnter={onEnter}
                  unmountOnExit
                >
                  <Component to={path === '*' ? '/ExampleOne' : null} />
                </CSSTransition>
              );
            }}
          </Route>
        ))}
      </CustomSwiper>
    </div>
  );
};

export default App;
