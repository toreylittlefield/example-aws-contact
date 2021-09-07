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

const animateIntroText = (
  introText = '' || [],
  options = {
    keepDisplay: false,
    move: false,
    typewrite: false,
    xPos: 0,
    yPos: 0,
  }
) => {
  const { keepDisplay, move, typewrite, xPos, yPos } = options;
  const createAnimation = () => {
    const introTextElement = document.getElementById('intro-text');
    const containerDiv = document.createElement('div');
    introTextElement.appendChild(containerDiv);
    containerDiv.setAttribute('class', 'intro-text-container');

    [...introText].forEach((letter) => {
      const div = document.createElement('div');
      containerDiv.appendChild(div);
      let copyLetter = letter;
      if (copyLetter === ' ') {
        copyLetter = '-';
        div.style.opacity = 0;
      }
      div.innerText = copyLetter;
    });
    const tl = gsap.timeline().set(containerDiv, { display: 'grid' });
    if (typewrite) {
      tl.set(containerDiv, { fontFamily: `'IBM Plex Sans', sans-serif` })
        .to(containerDiv, {
          xPercent: xPos,
          yPercent: yPos,
          scale: 0.2,
          duration: 0.2,
        })
        .from([containerDiv.children], {
          duration: 0.3,
          ease: 'none',
          autoAlpha: 0,
          yoyo: true,
          stagger: {
            yoyo: true,
            each: 0.1,
          },
        });
    } else {
      tl.from([containerDiv.children], {
        duration: 1,
        ease: 'back',
        autoAlpha: 0,
        skewX: -15,
        y: -100,
        stagger: {
          each: 0.2,
        },
      });
    }
    if (move)
      tl.to([containerDiv.children], {
        duration: 0.7,
        ease: 'power3.in',
        y: -50,
        x: -50,
        stagger: {
          each: -0.1,
        },
      }).to(
        containerDiv,
        { duration: 0.7, scale: 0.25, yPercent: -30, xPercent: -80 },
        '<'
      );
    if (keepDisplay) return tl;
    tl.to(
      [containerDiv.children],
      {
        duration: 0.7,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set([containerDiv], { display: 'none' });
        },
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
  return createAnimation(introText);
};

export const onStartWrapper = (pageWrapper, curtain) =>
  gsap
    .timeline()
    .set(document.body, { overflow: 'hidden' })
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
    .add(animateIntroText('Welcome!'), '<50%')
    .add(animateIntroText(`Let's Code`, { keepDisplay: true, move: true }))
    .add(
      animateIntroText(`npm run start ...`, {
        keepDisplay: true,
        move: false,
        typewrite: true,
        // xPos: -50,
      })
    )
    .add(
      animateIntroText(`building ...`, {
        keepDisplay: true,
        move: false,
        typewrite: true,
        yPos: 25,
      }).repeat(3)
    )
    .add(
      animateIntroText(`Compiled successfully!`, {
        keepDisplay: true,
        move: false,
        typewrite: true,
        yPos: 50,
      })
    )
    .to(['.intro-text-container div'], {
      autoAlpha: 0,
      duration: 0.3,
      x: -10,

      stagger: { each: 0.05 },
    })

    .set(pageWrapper, { transformOrigin: 'top top' })
    .to(
      pageWrapper,
      {
        scaleY: 0,
        duration: 2.5,
        onComplete: () => gsap.set(pageWrapper, { autoAlpha: 0 }),
      },
      '<75%'
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
    .from(
      ['header', '.page-wrapper', 'section'],
      {
        autoAlpha: 0,
        duration: 0.4,
      },
      '<50%'
    )
    .set([document.body, pageWrapper, curtain, 'section'], {
      clearProps: 'all',
    })
    .then(() => document.getElementById('intro-text').remove());

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
      },
      onInterrupt: () => {
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
