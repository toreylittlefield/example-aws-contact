import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import { gsap } from 'gsap';
import { onStartWrapper } from '../Animations/pageTransitions';

export const IntroAnimation = () => {
  const introTimeline = useRef(null);

  const [isIntroAniRunning, setIsIntroAniRunning] = useState(null);

  useEffect(() => {
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

  const handleSkipIntro = () => {
    setIsIntroAniRunning(false);
    introTimeline.current.totalProgress(0.9);
  };
  return (
    <>
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
    </>
  );
};
