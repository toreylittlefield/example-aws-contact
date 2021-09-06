import { gsap } from 'gsap';

export const exitAnimation = (
  elementsToAnimate,
  gsapTimingState,
  moveGsap,
  reversed,
  node
) => {
  const curTl = gsap.timeline().set(document.body, { overflow: 'hidden' });
  if (node && gsap.getProperty(node, 'display') === 'none')
    gsap.set(node, { clearProps: 'display' });
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

const animateIntroText = () => {
  const introTextElement = document.getElementById('intro-text');
  const introText = 'Welcome!';
  [...introText].forEach((letter) => {
    const div = document.createElement('div');
    introTextElement.appendChild(div);
    // span.style.cssText = `display: none; opacity: 0; visibility: 0`;
    div.innerText = letter;
  });
  const tl = gsap
    .timeline()
    .from([introTextElement.children], {
      duration: 1,
      ease: 'back',
      autoAlpha: 0,
      // display: 'none',
      skewX: -15,
      y: -100,
      stagger: {
        each: 0.2,
      },
    })
    .to(
      [introTextElement.children],
      {
        duration: 0.7,
        ease: 'power3.in',
        onComplete: () => gsap.set(introTextElement, { display: 'none' }),
        autoAlpha: 0,
        y: -10,
        skewX: 15,
        stagger: {
          each: -0.1,
        },
      },
      '<95%'
    );
  return tl;
};

export const onStartWrapper = (pageWrapper, curtain) =>
  gsap
    .timeline()
    .set([pageWrapper, curtain], {
      autoAlpha: 1,
      zIndex: 99999,
      scaleY: 2,
    })
    .set(pageWrapper, { backgroundColor: 'black' })
    .set(curtain, {
      scaleY: 0.1,
      skewY: 0,
      transformOrigin: 'center bottom',
    })
    .to(curtain, {
      ease: 'expo.inOut',
      duration: 3,
      scaleY: 10,
      yPercent: -200,
      skewY: 15,
      backgroundColor: 'white',
      stagger: {
        amount: 0.15,
      },
    })
    .to(
      pageWrapper,
      {
        yPercent: -200,
        autoAlpha: 1,
        duration: 0.3,
        skewY: 10,
        scaleY: 10,
        ease: 'none',
      },
      '<50%'
    )
    .add(animateIntroText(), '<50%')
    .set(pageWrapper, { transformOrigin: 'top top' })
    .to(
      pageWrapper,
      {
        scaleY: 0,
        duration: 2.5,
        onComplete: () => gsap.set(pageWrapper, { autoAlpha: 0 }),
      },
      '<95%'
    )
    .from(
      'section',
      {
        scale: 1.2,
        duration: 1,
        stagger: { amount: 0.15 },
        ease: 'back',
      },
      '<55%'
    )
    .set([pageWrapper, curtain, 'section'], { clearProps: 'all' });

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
        tl.clear();
        console.log({ active: tl.isActive() });
      },
      onInterrupt: () => {
        console.log('interrupt enter');
        tl.set([node, firstChild.children, secondChild, secondChild.children], {
          clearProps: 'all',
        });
        tl.clear();
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
