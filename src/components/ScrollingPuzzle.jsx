import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PuzzleScene from '../scenes/PuzzleScene';

gsap.registerPlugin(ScrollTrigger);

const ScrollingPuzzle = () => {
  const overlayRef = useRef(null);
  const stageRef = useRef(null);
  const scrollMotionRef = useRef({
    modelScale: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const ctx = gsap.context(() => {
      const scrollMotion = scrollMotionRef.current;

      gsap.set(stage, {
        xPercent: -50,
        yPercent: -50,
        x: '-5vw',
        y: '4vh',
        scale: 0.8,
        rotate: -12,
        opacity: 1,
      });

      gsap.set(scrollMotion, {
        modelScale: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
      });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(stage, {
          x: '-28vw',
          y: '22vh',
          scale: 0.8,
          rotate: -10,
          duration: 1,
        })
        .to(scrollMotion, {
          modelScale: 1,
          rotationX: 0.04,
          rotationY: 0.18,
          rotationZ: -0.03,
          duration: 1,
        }, '<')
        .to(stage, {
          x: '-36vw',
          y: '30vh',
          scale: 0.8,
          rotate: -12,
          duration: 1,
        })
        .to(scrollMotion, {
          modelScale: 1,
          rotationX: -0.02,
          rotationY: 0.32,
          rotationZ: 0.04,
          duration: 1,
        }, '<')
        .to(stage, {
          x: '-40vw',
          y: '40vh',
          scale: 0.8,
          rotate: -14,
          opacity: 0.7,
          duration: 1,
        })
        .to(scrollMotion, {
          modelScale: 1,
          rotationX: 0.06,
          rotationY: 0.42,
          rotationZ: 0.06,
          duration: 1,
        }, '<');

      ScrollTrigger.refresh();
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={stageRef}
        style={{
          position: 'absolute',
          left: '55%',
          top: '42%',
          width: 'min(860px, 118vw)',
          height: 'min(680px, 96vh)',
          pointerEvents: 'none',
          touchAction: 'none',
          willChange: 'transform, opacity',
        }}
      >
        <PuzzleScene
          className="w-full h-full"
          controlsEnabled={false}
          scrollMotionRef={scrollMotionRef}
        />
      </div>
    </div>
  );
};

export default ScrollingPuzzle;
