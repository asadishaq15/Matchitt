import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FINAL_MOTION_LEFT,
  HERO_PUZZLE_MOTION,
  JOIN_ANIM_DURATION,
  JOIN_HOLD_DURATION,
  JOIN_MODEL_SCALE_SEPARATED,
  JOIN_SCRUB,
  JOIN_SCROLL_VH,
  JOIN_STAGE_JOINED,
  JOIN_STAGE_SEPARATED,
  MATCH_STEPS_REVEAL_END,
  MATCH_STEPS_REVEAL_START,
  PUZZLE_Z_DEFAULT,
  PUZZLE_Z_JOIN,
} from '../constants/puzzleJoin';
import { onScrollReady, SCROLL_ROOT } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MQ = '(prefers-reduced-motion: reduce)';

const joinScrollDistance = () => window.innerHeight * JOIN_SCROLL_VH;

const JOIN_PHASE_END = JOIN_ANIM_DURATION;
const HOLD_PHASE_END = JOIN_ANIM_DURATION + JOIN_HOLD_DURATION;

const JOIN_STAGE_Y_SEPARATED_VH = parseFloat(JOIN_STAGE_SEPARATED.y);
const JOIN_STAGE_Y_JOINED_VH = parseFloat(JOIN_STAGE_JOINED.y);
const JOIN_STAGE_SCALE_SEPARATED = JOIN_STAGE_SEPARATED.scale;
const JOIN_STAGE_SCALE_JOINED = JOIN_STAGE_JOINED.scale;

const applyJoinStagePose = (stage, joinProgress) => {
  const t = gsap.utils.clamp(0, 1, joinProgress);
  gsap.set(stage, {
    ...JOIN_STAGE_SEPARATED,
    y: `${gsap.utils.interpolate(JOIN_STAGE_Y_SEPARATED_VH, JOIN_STAGE_Y_JOINED_VH, t)}vh`,
    scale: gsap.utils.interpolate(JOIN_STAGE_SCALE_SEPARATED, JOIN_STAGE_SCALE_JOINED, t),
  });
};

const hideMatchSteps = () => {
  const matchStepsEl = document.getElementById('match-steps');
  if (!matchStepsEl) return;

  gsap.set(matchStepsEl, {
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
  });

  const grid = matchStepsEl.querySelector('.match-steps-grid');
  if (grid) {
    gsap.set(grid, { y: 24 });
  }
};

const applyMatchStepsReveal = (progress) => {
  const matchStepsEl = document.getElementById('match-steps');
  if (!matchStepsEl) return;

  const revealT = gsap.utils.clamp(
    0,
    1,
    gsap.utils.mapRange(MATCH_STEPS_REVEAL_START, MATCH_STEPS_REVEAL_END, 0, 1, progress),
  );

  gsap.set(matchStepsEl, {
    opacity: revealT,
    visibility: revealT > 0 ? 'visible' : 'hidden',
    pointerEvents: revealT >= 1 ? 'auto' : 'none',
  });

  const grid = matchStepsEl.querySelector('.match-steps-grid');
  if (grid) {
    gsap.set(grid, { y: gsap.utils.interpolate(24, 0, revealT) });
  }
};

const applyJoinPinProgress = (scrollMotion, stage, progress) => {
  if (progress <= JOIN_PHASE_END) {
    scrollMotion.joinProgress = gsap.utils.mapRange(0, JOIN_PHASE_END, 0, 1, progress);
    scrollMotion.rotationY = 0;
    scrollMotion.rotationZ = 0;
    scrollMotion.separatedCorners = scrollMotion.joinProgress < 1;
    scrollMotion.modelScale = gsap.utils.interpolate(
      JOIN_MODEL_SCALE_SEPARATED,
      1,
      scrollMotion.joinProgress,
    );

    if (stage) {
      applyJoinStagePose(stage, scrollMotion.joinProgress);
      const stageOpacity =
        progress > 0.85
          ? gsap.utils.mapRange(0.85, 1, 1, 0.7, progress)
          : 1;
      gsap.set(stage, { opacity: stageOpacity });
    }

    applyMatchStepsReveal(progress);
    return;
  }

  scrollMotion.joinProgress = 1;
  scrollMotion.separatedCorners = false;
  scrollMotion.modelScale = 1;

  if (stage) {
    applyJoinStagePose(stage, 1);
    const stageOpacity =
      progress > 0.85 ? gsap.utils.mapRange(0.85, 1, 1, 0.7, progress) : 1;
    gsap.set(stage, { opacity: stageOpacity });
  }

  applyMatchStepsReveal(progress);

  if (progress <= HOLD_PHASE_END) {
    scrollMotion.rotationY = 0;
    scrollMotion.rotationZ = 0;
    return;
  }

  const tiltT = gsap.utils.mapRange(HOLD_PHASE_END, 1, 0, 1, progress);
  scrollMotion.rotationY = tiltT * FINAL_MOTION_LEFT.rotationY;
  scrollMotion.rotationZ = tiltT * FINAL_MOTION_LEFT.rotationZ;
};

const revealJoinPhase = (stage, overlay, scrollMotion) => {
  hideMatchSteps();
  scrollMotion.joinProgress = 0;
  scrollMotion.rotationX = 0;
  scrollMotion.rotationY = 0;
  scrollMotion.rotationZ = 0;
  scrollMotion.separatedCorners = true;
  scrollMotion.modelScale = JOIN_MODEL_SCALE_SEPARATED;
  applyJoinStagePose(stage, 0);
  gsap.set(stage, { opacity: 1 });
  gsap.set(overlay, { zIndex: PUZZLE_Z_JOIN });
};

const applyHeroPuzzleMotion = (scrollMotion) => {
  Object.assign(scrollMotion, HERO_PUZZLE_MOTION);
};

const hideAboveJoin = (stage, overlay, scrollMotion) => {
  gsap.set(stage, { opacity: 0 });
  applyHeroPuzzleMotion(scrollMotion);
  hideMatchSteps();
  overlay.style.zIndex = String(PUZZLE_Z_DEFAULT);
};

const hidePuzzleOverlay = (stage, overlay) => {
  gsap.set(stage, { opacity: 0 });
  overlay.style.zIndex = String(PUZZLE_Z_DEFAULT);
};

/** Restore join-phase puzzle when scrolling back up from Who We Work With. */
const restoreJoinPuzzleIfPastHero = (stage, overlay, scrollMotion) => {
  const joinST = ScrollTrigger.getById('puzzle-join-scroll');
  if (!joinST || joinST.progress <= 0) return;

  gsap.set(overlay, { zIndex: PUZZLE_Z_JOIN });
  const progress = Math.min(joinST.progress, 1);
  applyJoinPinProgress(scrollMotion, stage, progress);
  gsap.set(stage, { opacity: progress > 0.85 ? 0.7 : 1 });
};

/**
 * Pinned join phase: separated corner pieces → scrub join → left tilt.
 * Hidden between hero end and this section.
 */
export const usePuzzleJoinScroll = ({ scrollMotionRef, stageRef, overlayRef }) => {
  useEffect(() => {
    let ctx;
    let disposed = false;

    const setup = () => {
      if (disposed) return;

      const joinEl = document.getElementById('puzzle-join');
      const stage = stageRef?.current;
      const overlay = overlayRef?.current;
      const scrollMotion = scrollMotionRef?.current;

      if (!joinEl || !stage || !overlay || !scrollMotion) return;

      hideMatchSteps();

      const prefersReduced = window.matchMedia(REDUCED_MQ).matches;

      ctx = gsap.context(() => {
        const attachWhoWeWorkWithHide = () => {
          const whoWeWorkEl = document.getElementById('who-we-work-with');
          if (!whoWeWorkEl) return;

          ScrollTrigger.create({
            scroller: SCROLL_ROOT,
            invalidateOnRefresh: true,
            id: 'puzzle-hide-who-we-work-with',
            trigger: whoWeWorkEl,
            start: 'top bottom',
            onEnter: () => hidePuzzleOverlay(stage, overlay),
            onEnterBack: () => hidePuzzleOverlay(stage, overlay),
            onLeaveBack: () =>
              restoreJoinPuzzleIfPastHero(stage, overlay, scrollMotion),
          });
        };

        if (prefersReduced) {
          scrollMotion.joinProgress = 1;
          scrollMotion.separatedCorners = false;
          scrollMotion.modelScale = 1;
          scrollMotion.rotationY = FINAL_MOTION_LEFT.rotationY;
          scrollMotion.rotationZ = FINAL_MOTION_LEFT.rotationZ;
          applyJoinStagePose(stage, 1);
          gsap.set(stage, { opacity: 1 });
          gsap.set(overlay, { opacity: 1, zIndex: PUZZLE_Z_JOIN });
          applyMatchStepsReveal(1);
          attachWhoWeWorkWithHide();
          requestAnimationFrame(() => ScrollTrigger.refresh());
          return;
        }

        ScrollTrigger.create({
          scroller: SCROLL_ROOT,
          invalidateOnRefresh: true,
          id: 'puzzle-join-scroll',
          trigger: joinEl,
          start: 'top top',
          end: () => `+=${joinScrollDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: JOIN_SCRUB,
          anticipatePin: 1,
          fastScrollEnd: true,
          onEnter() {
            revealJoinPhase(stage, overlay, scrollMotion);
          },
          onEnterBack() {
            revealJoinPhase(stage, overlay, scrollMotion);
          },
          onUpdate(self) {
            if (!self.isActive) {
              if (self.progress <= 0) {
                hideAboveJoin(stage, overlay, scrollMotion);
              } else if (self.progress >= 1) {
                applyJoinPinProgress(scrollMotion, stage, 1);
              }
              return;
            }
            applyJoinPinProgress(scrollMotion, stage, self.progress);
          },
          onLeave() {
            hidePuzzleOverlay(stage, overlay);
          },
          onLeaveBack() {
            hideAboveJoin(stage, overlay, scrollMotion);
          },
        });

        attachWhoWeWorkWithHide();

        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };

    const unsub = onScrollReady(setup);

    return () => {
      disposed = true;
      unsub();
      ctx?.revert();
    };
  }, [scrollMotionRef, stageRef, overlayRef]);
};
