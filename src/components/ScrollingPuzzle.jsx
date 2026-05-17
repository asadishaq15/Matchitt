import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PuzzleScene from '../scenes/PuzzleScene';
import { usePuzzleJoinScroll } from '../hooks/usePuzzleJoinScroll';
import {
  HERO_PUZZLE_MOTION,
  HERO_STAGE_INITIAL,
  HERO_STAGE_SCALE,
} from '../constants/puzzleJoin';
import { onScrollReady, SCROLL_ROOT } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

const ScrollingPuzzle = () => {
  const overlayRef = useRef(null);
  const stageRef = useRef(null);
  const scrollMotionRef = useRef({
    ...HERO_PUZZLE_MOTION,
    modelScale: 1,
  });

  usePuzzleJoinScroll({ scrollMotionRef, stageRef, overlayRef });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    let ctx;
    let disposed = false;

    const setup = () => {
      if (disposed || !stageRef.current) return;

      ctx = gsap.context(() => {
        const scrollMotion = scrollMotionRef.current;

        gsap.set(stage, {
          xPercent: -50,
          yPercent: -50,
          opacity: 1,
          ...HERO_STAGE_INITIAL,
        });

        gsap.set(scrollMotion, HERO_PUZZLE_MOTION);

        const heroEl = document.getElementById('hero');
        const applyHeroJoinedState = () => {
          Object.assign(scrollMotion, HERO_PUZZLE_MOTION);
        };

        const scrollTriggerConfig = {
          scroller: SCROLL_ROOT,
          trigger: heroEl ?? document.body,
          start: 'top top',
          end: heroEl ? 'bottom bottom' : 'bottom bottom',
          scrub: 0.35,
          invalidateOnRefresh: true,
          onEnter: applyHeroJoinedState,
          onEnterBack: applyHeroJoinedState,
        };

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: scrollTriggerConfig,
        });

        timeline.set(scrollMotion, HERO_PUZZLE_MOTION, 0);

        timeline
          .to(stage, {
            x: '28vw',
            y: '22vh',
            scale: HERO_STAGE_SCALE,
            rotate: 10,
            duration: 1,
          })
          .to(scrollMotion, {
            modelScale: 1,
            rotationX: 0.04,
            rotationY: -0.18,
            rotationZ: 0.03,
            duration: 1,
          }, '<')
          .to(stage, {
            x: '36vw',
            y: '30vh',
            scale: HERO_STAGE_SCALE,
            rotate: 12,
            duration: 1,
          })
          .to(scrollMotion, {
            modelScale: 1,
            rotationX: -0.02,
            rotationY: -0.32,
            rotationZ: -0.04,
            duration: 1,
          }, '<')
          .to(stage, {
            x: '40vw',
            y: '40vh',
            scale: HERO_STAGE_SCALE,
            rotate: 14,
            opacity: 0.7,
            duration: 1,
          })
          .to(scrollMotion, {
            modelScale: 1,
            rotationX: 0.06,
            rotationY: -0.42,
            rotationZ: -0.06,
            duration: 1,
          }, '<')
          .to(stage, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
          });

        const overlay = overlayRef.current;
        if (overlay) {
          gsap.set(overlay, { opacity: 1 });
        }

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, overlayRef);
    };

    const unsub = onScrollReady(setup);

    return () => {
      disposed = true;
      unsub();
      ctx?.revert();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 18,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={stageRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '100vw',
          height: '100vh',
          opacity: 0,
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