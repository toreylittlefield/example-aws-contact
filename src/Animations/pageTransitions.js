import { gsap } from 'gsap';

export const exitAnimation = (
  elementsToAnimate,
  gsapTimingState,
  moveGsap,
  reversed
) => {
  const curTl = gsap.timeline().set(document.body, { overflow: 'hidden' });
  if (reversed) {
    curTl.from(elementsToAnimate, {
      ease: 'power3.In',
      duration: gsapTimingState.duration,
      [moveGsap]: -10,
      autoAlpha: 0,
      stagger: {
        amount: gsapTimingState.stagger,
      },
    });
    return curTl;
  }
  curTl.to(elementsToAnimate, {
    ease: 'power3.In',
    duration: gsapTimingState.duration,
    [moveGsap]: -100,
    autoAlpha: 0,
    stagger: {
      amount: gsapTimingState.stagger,
    },
  });
  return curTl;
};
export const wrapperAnimation = (pageWrapper, curtain) =>
  gsap
    .timeline()
    .set([pageWrapper, curtain], {
      autoAlpha: 1,
    })
    .set(curtain, {
      scaleX: 0,
      skewX: 0,
      transformOrigin: 'top right',
    })
    .to(curtain, {
      ease: 'expo.inOut',
      duration: 0.6,
      scaleX: 4,
      skewX: 60,
      stagger: {
        amount: 0.2,
      },
    })
    .set(curtain, {
      transformOrigin: 'left top',
      skewX: 0,
      // scale: 1,
    })
    .to(curtain, {
      ease: 'expo.inOut',
      duration: 0.6,
      scaleX: 0,
      skewY: 60,

      stagger: {
        amount: -0.2,
      },
    })
    .to(
      pageWrapper,
      {
        autoAlpha: 0,
        duration: 0.3,
      },
      '>'
    )
    .set([pageWrapper, curtain], { clearProps: 'all' });

export const enterAnimation = (
  node,
  firstChild,
  secondChild,
  tl,
  moveGsap,
  gsapTimingState
) =>
  gsap
    .timeline()
    .set(document.body, { overflow: 'hidden' })
    .set(node, { display: 'none' })
    .from([firstChild.children, secondChild, secondChild.children], {
      onStart: () => gsap.set(node, { clearProps: 'display' }),
      onComplete: () => {
        gsap.set(document.body, { clearProps: 'overflow' });
        tl.current.clear();
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
