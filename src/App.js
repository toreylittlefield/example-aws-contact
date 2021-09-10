import { useState, useMemo } from 'react';
import './App.css';
import { Transition } from 'react-transition-group';
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

  // state
  // const [viewpathIndex, setviewpathIndex] = useState(null);
  const [reverseAnimation, setReverseAnimation] = useState(false);
  const [prevElements, setPrevElements] = useState({
    exitEl: null,
    enterEl: null,
    wrapper: null,
  });

  const matchesMemo = useMemo(() => matches, [matches]);
  const moveGsap = matchesMemo ? 'xPercent' : 'yPercent';
  // custom hooks
  const [viewPathIndex, setViewPathIndex] = useRouterPathIndex(routes, history);
  useRecaptchaCleanup(location);
  const [gsapTimingState] = usePageTransitions(
    prevElements,
    reverseAnimation,
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
