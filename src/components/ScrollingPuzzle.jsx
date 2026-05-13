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
        scale: 0.92,
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
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(stage, {
          x: '-28vw',
          y: '22vh',
          scale: 0.78,
          rotate: -16,
          duration: 1,
        })
        .to(scrollMotion, {
          modelScale: 0.92,
          rotationX: 0.08,
          rotationY: Math.PI * 0.5,
          rotationZ: -0.08,
          duration: 1,
        }, '<')
        .to(stage, {
          x: '28vw',
          y: '28vh',
          scale: 0.64,
          rotate: 10,
          duration: 1,
        })
        .to(scrollMotion, {
          modelScale: 0.82,
          rotationX: -0.08,
          rotationY: Math.PI * 1.45,
          rotationZ: 0.18,
          duration: 1,
        }, '<')
        .to(stage, {
          x: '0vw',
          y: '42vh',
          scale: 0.5,
          rotate: 18,
          opacity: 0.35,
          duration: 1,
        })
        .to(scrollMotion, {
          modelScale: 0.72,
          rotationX: 0.18,
          rotationY: Math.PI * 2.1,
          rotationZ: 0.28,
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
          top: '40%',
          width: 'min(560px, 82vw)',
          height: 'min(560px, 72vh)',
          pointerEvents: 'auto',
          touchAction: 'none',
          willChange: 'transform, opacity',
        }}
      >
        <PuzzleScene
          className="w-full h-full"
          controlsEnabled
          scrollMotionRef={scrollMotionRef}
        />
      </div>
    </div>
  );
};

export default ScrollingPuzzle;
