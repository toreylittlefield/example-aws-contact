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
  const [viewIndex, setviewIndex] = useState(null);
  const [gsapTimingState, setGsapTimingState] = useState(initGsapTiming);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesMemo = useMemo(() => matches, [matches]);
  const introTimeline = useRef(null);
  const swiperRef = useRef(null);

  const initialState = () => {
    const pathOnLoad = history.location.pathname;
    const initIndex = routes.findIndex((route) => route.path === pathOnLoad);
    return initIndex === -1 ? 0 : initIndex;
  };

  const [isIntroAniRunning, setIsIntroAniRunning] = useState(null);

  useEffect(() => {
    if (viewIndex === null) setviewIndex(initialState);
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

  const handleSkipIntro = () => {
    setIsIntroAniRunning(false);
    introTimeline.current.totalProgress(0.9);
  };

  // const handleChangeIndex = (index) => {
  //   if (index >= routes.length) return;
  //   const pathTo = routes[index].path;
  //   setviewIndex(index);
  //   history.push(pathTo);
  // };
  const [reverseAnimation, setReverseAnimation] = useState(false);
  const [prevElements, setPrevElements] = useState({
    exitEl: null,
    enterEl: null,
    wrapper: null,
  });

  const moveGsap = matchesMemo ? 'xPercent' : 'yPercent';

  // page transitions handled here animation
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

  const [isMoving, setIsMoving] = useState(false);
  const initalMovePos = { xPos: 0, eventMovX: 0 };
  const [movePos, setMovePos] = useState(initalMovePos);

  useEffect(() => {
    if (isMoving === false) return;
    const parentContainer = swiperRef.current;
    let totalXMovement = 0;
    let threshold = 90;
    let registerMove = false;
    let setToTouch = false;
    // let allowMove = true;
    const tl = gsap;
    /**
     *
     * @param {PointerEvent} event
     * @returns
     */
    const handlePointerMove = (event) => {
      console.log({ event });
      if (event.isPrimary === false) return;
      if (registerMove === false) {
        registerMove = true;
        return;
      }
      gsap.set(document.body, { overflow: 'hidden' });
      const currentPath = location.pathname;
      const index = routes.findIndex((route) => route.path === currentPath);

      totalXMovement += event.movementX;
      setMovePos((prev) => {
        const copy = prev;
        copy.xPos = totalXMovement;
        copy.eventMovX = event.movementX;
        return copy;
      });
      let currentMoveAmount = event.movementX;
      if (totalXMovement > event.pageX) currentMoveAmount = event.pageX / 2;
      if (totalXMovement < -1 * event.pageX)
        currentMoveAmount = event.pageX / 2;
      if (index === 0 && totalXMovement < 0) {
        totalXMovement = 0;
        return;
      }
      if (index === routes.length - 2 && totalXMovement > 0) {
        totalXMovement = 0;
        return;
      }
      if (event.pointerType === 'touch' && setToTouch === false) {
        setToTouch = true;
        currentMoveAmount *= 10;
        totalXMovement *= 10;
        threshold = 4;
      }
      if (Math.abs(totalXMovement) < threshold) return;

      tl.to(parentContainer, {
        overwrite: 'auto',
        // userSelect: 'none',
        // touchAction: 'none',
        ease: 'none',
        duration: 0.3,
        x: `+=${Math.ceil(currentMoveAmount)}`,
        // skewX: `+=${Math.ceil(currentMoveAmount)}`,
        // scale: `+=${-1 * Math.abs(Math.ceil(currentMoveAmount) / 10)}`,
        onComplete: () => {
          if (Math.abs(totalXMovement) > threshold * 1.1) {
            // allowMove = false;

            tl.to(parentContainer, {
              x: 0,
              overwrite: 'auto',
              skewX: 0,
              delay: 2,
              duration: 0,
              ease: 'none',
              onComplete: () => {
                tl.from(parentContainer, {
                  duration: 0.3,
                  ease: 'none',
                  backgroundColor: 'green',
                });
                setMovePos(initalMovePos);
              },
            });
            // if (totalXMovement > 0) history.push(routes[index + 1].path);
            // if (totalXMovement < 0) history.push(routes[index - 1].path);
          } else {
            tl.to(parentContainer, {
              x: 0,
              skewX: 0,
              duration: 1,
              ease: 'back',
              overwrite: 'auto',
            });
            setMovePos(initalMovePos);
          }
        },
      });
    };

    parentContainer.onpointermove = handlePointerMove;
    return () => {
      // tl.globalTimeline.set(swiperRef.current, { clearProps: 'all' });
    };
  }, [isMoving]);

  /**
   *
   * @param {PointerEvent} event
   */
  const handlePointerDown = () => {
    // event.preventDefault();
    // console.log({ event });
    // console.log('handle pointer down');
    setIsMoving(true);
  };

  const handlePointerUp = (event) => {
    event.preventDefault();
    swiperRef.current.onpointermove = null;
    // gsap.set(swiperRef.current, { clearProps: 'all' });
    gsap.set(document.body, { clearProps: 'all' });
    setIsMoving(false);
  };

  const handlePointerLeave = (event) => {
    event.preventDefault();
    swiperRef.current.onpointermove = null;
    gsap.set(document.body, { clearProps: 'all' });

    // gsap.set(swiperRef.current, { clearProps: 'all' });
    setIsMoving(false);
  };

  const [moveEvent, setMoveEvent] = useState(null);
  const handleMove = (event) =>
    setMoveEvent((prev) => {
      const {
        // clientX,
        // clientY,
        pageX,
        // pageY,
        movementX,
        // movementY,
        // screenX,
        // screenY,
      } = event;
      const copy = prev;
      let movXCumulative = 0;
      if (copy !== null && copy.movXCumulative && copy.movXCumulative !== null)
        movXCumulative = copy.movXCumulative;
      return {
        // clientX,
        // clientY,
        pageX,
        // pageY,
        movementX,
        // movementY,
        movXCumulative: movXCumulative + movementX,
        // screenX,
        // screenY,
      };
    });

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
        onPointerLeave={handlePointerLeave}
        onPointerMove={handleMove}
      >
        <Button
          onClick={() => setMoveEvent(null)}
          variant="outlined"
          color="primary"
          id="btn-reset"
        >
          Reset MoveEvent
        </Button>
        <h1>{JSON.stringify(moveEvent, null, 2)}</h1>
        <h2>{JSON.stringify(movePos, null, 2)}</h2>
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
