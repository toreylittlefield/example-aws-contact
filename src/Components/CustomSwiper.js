import React, { useRef, useState, useEffect } from 'react';

export const CustomSwiper = ({ history, location, routes, children }) => {
  const swiperRef = useRef(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const startingPos = useRef(null);

  const resetStyles = (element) => {
    const el = element;
    el.style.cssText = '';
  };

  const [willTransition, setWillTransition] = useState(false);

  /**
   *
   * @param {PointerEvent} event
   */
  const handlePointerDown = (event) => {
    event.stopPropagation();
    if (event.isPrimary === false) return;
    if (event.movementY > event.movementX) return;
    setIsPointerDown(true);
    startingPos.current = { startX: event.clientX, startY: event.clientY };
  };

  const handlePointerUp = (event) => {
    event?.stopPropagation();
    setTimeout(() => {
      swiperRef.current.onpointermove = null;
      if (willTransition === false) {
        resetStyles(swiperRef.current);
      }
      setIsPointerDown(false);
    }, 350);
  };

  useEffect(() => {
    if (isPointerDown === false) return;
    const parentContainer = swiperRef.current;
    let totalXMovement = 0;
    let threshold = 90;
    let deltaX = 0;
    let raf;
    let multiplier = 1;
    let addListener = false;
    const endPathIndex = routes.length - 2;
    const transitionPageThreshold =
      document.body.getBoundingClientRect().width / 4;
    const animationLimit = transitionPageThreshold * 1.5;
    // For Single Swipe - Handling a single fast swipe range
    // eslint-disable-next-line prefer-const
    let [lowerBound, upperBound, eventCount] = [7, 30, 0];
    document.body.style.overflow = 'hidden';
    const currentPath = location.pathname;
    const pathIndex = routes.findIndex((route) => route.path === currentPath);
    /**
     *
     * @param {PointerEvent} event
     * @returns
     */
    const handlePointerMove = (event) => {
      if (Math.abs(event.movementY) > Math.abs(event.movementX)) return;

      eventCount += 1;

      totalXMovement = event.clientX - startingPos.current.startX;
      // if user is selecting text do not register swipe
      if (
        eventCount > 1 &&
        Math.abs(totalXMovement) <= lowerBound &&
        window.getSelection().toString().length > 0
      ) {
        handlePointerUp();
        return;
      }

      if (event.pointerType === 'touch') {
        threshold = 3;
      }

      // routes / pathIndex boundaries do not allow movement
      const checkBoundaries = (index = 0, length = 0, boundary = 0) => {
        const bounds = { withInBounds: false, boundaryValue: 0 };
        if (index === 0 && boundary > 0) {
          return bounds;
        }
        if (index === length && boundary < 0) {
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
        if (init) {
          el.style.touchAction = 'none';
          el.style.userSelect = 'none';
          el.style.transition = `transform .65s cubic-bezier(0.15, 0.3, 0.25, 1)`;
        }
        if (value) {
          const fractionalValue = parseFloat(1 - value / 100);
          el.style.transform = `translate3d(${value}px, 0px, 0px) skewX(${fractionalValue}deg) rotateY(${fractionalValue}deg) scale(${
            1 - Math.abs(fractionalValue / 50)
          })`;
        }
      };
      setStyles(parentContainer, { init: true });

      const userMovedRaf = () => {
        if (Math.abs(totalXMovement) > transitionPageThreshold) return;
        let moveAmount = deltaX * multiplier;
        if (moveAmount >= animationLimit) moveAmount = animationLimit;
        setStyles(parentContainer, { animate: moveAmount });
        // once the paint job is done we 'release' animation frame variable to allow next paint job:
        raf = null;
      };
      const userMoved = (e) => {
        // if no previous request for animation frame - we allow js to proccess 'move' event:
        if (!raf) {
          deltaX = e.clientX - startingPos.current.startX;
          raf = requestAnimationFrame(userMovedRaf);
        }
      };

      userMoved(event);

      if (Math.abs(totalXMovement * multiplier) > transitionPageThreshold) {
        if (addListener === true) return;
        addListener = true;
        setWillTransition(true);
        cancelAnimationFrame(userMovedRaf);
        const pushNewRoute = (el, movPos) => {
          let left = false;
          if (movPos > 0) left = true;
          el.addEventListener(
            'transitionend',
            () => {
              // setStyles(parentContainer, { animate: moveAmount });
              if (left) history.push(routes[pathIndex - 1].path);
              else history.push(routes[pathIndex + 1].path);
            },
            { once: true }
          );
        };
        pushNewRoute(parentContainer, totalXMovement);
      }
    };

    parentContainer.onpointermove = handlePointerMove;
    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
  }, [isPointerDown]);

  useEffect(() => {
    if (willTransition === false) return;
    const timeOut = setTimeout(() => {
      resetStyles(swiperRef.current);
      setWillTransition(false);
    }, 1500);
    return () => clearTimeout(timeOut);
  }, [willTransition]);
  return (
    <div
      id="swiper"
      ref={swiperRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {children}
    </div>
  );
};
