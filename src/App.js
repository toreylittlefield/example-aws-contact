import { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import { Transition } from 'react-transition-group';
import { gsap } from 'gsap';
import { Button, useMediaQuery, useTheme } from '@material-ui/core';
import { Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import {
  enterAnimation,
  exitAnimation,
  wrapperAnimation,
  onStartWrapper,
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
  const [viewpathIndex, setviewpathIndex] = useState(null);
  const [gsapTimingState, setGsapTimingState] = useState(initGsapTiming);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesMemo = useMemo(() => matches, [matches]);
  const introTimeline = useRef(null);
  const swiperRef = useRef(null);

  const initialState = () => {
    const pathOnLoad = history.location.pathname;
    const initpathIndex = routes.findIndex(
      (route) => route.path === pathOnLoad
    );
    return initpathIndex === -1 ? 0 : initpathIndex;
  };

  const [isIntroAniRunning, setIsIntroAniRunning] = useState(null);

  useEffect(() => {
    if (viewpathIndex === null) setviewpathIndex(initialState);
    if (isIntroAniRunning === false || isIntroAniRunning) return;
    setIsIntroAniRunning(true);
    introTimeline.current = gsap.globalTimeline;
    introTimeline.current.add(
      'start',
      onStartWrapper('.page-wrapper', '.curtain').then(() =>
        setIsIntroAniRunning(false)
      )
    );
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

  const handleSkipIntro = () => {
    setIsIntroAniRunning(false);
    introTimeline.current.totalProgress(0.9);
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

  const [isPointerDown, setIsPointerDown] = useState(false);
  const startX = useRef(null);

  useEffect(() => {
    if (isPointerDown === false) return;
    const parentContainer = swiperRef.current;
    let totalXMovement = 0;
    let threshold = 90;
    let deltaX = 0;
    let raf;
    let multiplier = 1;
    const endPathIndex = routes.length - 2;
    // For Single Swipe - Handling a single fast swipe range
    // eslint-disable-next-line prefer-const
    let [lowerBound, upperBound, eventCount] = [7, 30, 0];
    gsap.set(document.body, { overflow: 'hidden' });
    const currentPath = location.pathname;
    const pathIndex = routes.findpathIndex(
      (route) => route.path === currentPath
    );
    /**
     *
     * @param {PointerEvent} event
     * @returns
     */
    const handlePointerMove = (event) => {
      eventCount += 1;

      totalXMovement = event.clientX - startX.current;
      // if user is selecting text do not register swipe
      if (
        eventCount > 1 &&
        Math.abs(totalXMovement) <= lowerBound &&
        window.getSelection().toString().length > 0
      )
        return;

      if (event.pointerType === 'touch') {
        threshold = 7;
      }

      // routes / pathIndex boundaries do not allow movement
      const checkBoundaries = (index = 0, length = 0, boundary = 0) => {
        const bounds = { withInBounds: false, boundaryValue: 0 };
        if (index === 0 && boundary < 0) {
          return bounds;
        }
        if (index === length && boundary > 0) {
          return bounds;
        }
        bounds.boundaryValue = boundary;
        bounds.withInBounds = true;
        return bounds;
      };

      const { withInBounds, boundaryValue } = checkBoundaries(
        pathIndex,
        endPathIndex,
        totalXMovement
      );
      totalXMovement = boundaryValue;
      if (!withInBounds) return;

      // animate only if passed our threshold
      if (Math.abs(totalXMovement) < threshold && eventCount === 1) return;

      if (eventCount === 1) {
        if (
          Math.abs(totalXMovement) >= lowerBound &&
          Math.abs(totalXMovement) <= upperBound
        )
          multiplier *= 15;
      } else {
        multiplier = 1;
      }

      const setStyles = (element, { init = false, animate: value }) => {
        const el = element;
        if (init) el.style.touchAction = 'none';
        el.style.userSelect = 'none';
        el.style.transition = `transform .65s cubic-bezier(0.15, 0.3, 0.25, 1)`;
        if (value)
          el.style.transform = `translate3d(${value}px, 0px, 0px) skewX(${parseFloat(
            1 - value / 100
          )}deg)`;
      };
      setStyles(parentContainer, { init: true });

      const resetStyles = (element) => {
        const el = element;
        el.style.cssText = '';
      };

      const userMovedRaf = () => {
        console.log({ totalXMovement });
        console.log(document.body.getBoundingClientRect().width / 2);
        if (totalXMovement > document.body.getBoundingClientRect().width / 2)
          return;
        setStyles(parentContainer, { animate: deltaX * multiplier });
        // once the paint job is done we 'release' animation frame variable to allow next paint job:
        raf = null;
      };
      const userMoved = (e) => {
        // if no previous request for animation frame - we allow js to proccess 'move' event:
        if (!raf) {
          if (
            Math.abs(deltaX * multiplier) >
            document.body.getBoundingClientRect().width / 2
          ) {
            console.count('cancel raf');
            // threshold * 2.5
            cancelAnimationFrame(userMovedRaf);
            // alert(JSON.stringify({ totalXMovement, threshold }, null, 2));
            // parentContainer.style.transform += `scale(0.85)`;
            // parentContainer.style.transform = ``;
            // parentContainer.style.transiton = ``;
            // parentContainer.style.userSelect = '';
            resetStyles(parentContainer);
            setTimeout(() => {
              if (totalXMovement > 0) history.push(routes[pathIndex + 1].path);
              if (totalXMovement < 0) history.push(routes[pathIndex - 1].path);
            }, 350);
            setTimeout(() => {
              resetStyles(parentContainer);
              // parentContainer.style.transform = ``;
              // // parentContainer.style.transiton = ``;
              // parentContainer.style.userSelect = '';
              // parentContainer.style.touchAction = '';
            }, 1000);
            return;
          }
          deltaX = e.clientX - startX.current;
          raf = requestAnimationFrame(userMovedRaf);
        }
      };

      userMoved(event);
    };

    parentContainer.onpointermove = handlePointerMove;
    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
        // parentContainer.style.transform = ``;
        // // parentContainer.style.transiton = ``;
        // parentContainer.style.userSelect = '';
        // parentContainer.style.touchAction = '';
      }
    };
  }, [isPointerDown]);

  /**
   *
   * @param {PointerEvent} event
   */
  const handlePointerDown = (event) => {
    event.stopPropagation();
    if (event.isPrimary === false) return;
    setIsPointerDown(true);
    startX.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    console.count('p up');
    event.stopPropagation();
    setTimeout(() => {
      swiperRef.current.onpointermove = null;
      // swiperRef.current.style.transform = ``;
      // // swiperRef.current.style.transiton = ``;
      // swiperRef.current.style.userSelect = '';
      // swiperRef.current.style.touchAction = '';
      setIsPointerDown(false);
    }, 500);
  };

  return (
    <div className="App">
      <div id="intro-text"> </div>
      {isIntroAniRunning && (
        <Button
          onClick={handleSkipIntro}
          variant="outlined"
          color="primary"
          id="btn-skip-intro"
        >
          Skip Intro
        </Button>
      )}
      <NavBar handleChange={handleChange} />
      <div className="page-wrapper">
        <div className="curtain" />
        <div className="curtain" />
        <div className="curtain" />
      </div>
      <div
        id="swiper"
        ref={swiperRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
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
      </div>
    </div>
  );
};

export default App;
