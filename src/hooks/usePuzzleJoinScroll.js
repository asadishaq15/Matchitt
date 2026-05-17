import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FINAL_MOTION_RIGHT,
  HERO_PUZZLE_MOTION,
  JOIN_ANIM_DURATION,
  JOIN_MODEL_SCALE_SEPARATED,
  JOIN_SCRUB,
  JOIN_SCROLL_VH,
  JOIN_STAGE_ABOVE_CARDS,
  JOIN_STAGE_JOINED,
  JOIN_STAGE_SEPARATED,
  MATCH_STEPS_CAROUSEL_END,
  MATCH_STEPS_CAROUSEL_START,
  MATCH_STEPS_PUZZLE_LIFT_END,
  MATCH_STEPS_REVEAL_END,
  MATCH_STEPS_REVEAL_START,
  PUZZLE_Z_DEFAULT,
  PUZZLE_Z_JOIN,
  TILT_PHASE_START,
} from '../constants/puzzleJoin';
import { setCarouselScrubPhase, setDrivenByScroll } from '../lib/matchStepsCarouselDrive';
import {
  getMatchStepsTrack,
  invalidateCarouselMeasure,
  measureCarousel,
  resetMatchStepsCarousel,
  setCarouselProgress,
} from '../lib/matchStepsCarouselScroll';
import {
  forceUnlockMatchStepsViewport,
  updateMatchStepsViewportLock,
} from '../lib/matchStepsViewportLock';
import { onScrollReady, SCROLL_ROOT } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MQ = '(prefers-reduced-motion: reduce)';
const DESKTOP_SCROLL_MQ = '(min-width: 769px) and (prefers-reduced-motion: no-preference)';
const CORNERS_JOINED_THRESHOLD = 0.999;

const joinScrollDistance = () => window.innerHeight * JOIN_SCROLL_VH;

const JOIN_STAGE_Y_SEPARATED_VH = parseFloat(JOIN_STAGE_SEPARATED.y);
const JOIN_STAGE_Y_JOINED_VH = parseFloat(JOIN_STAGE_JOINED.y);
const JOIN_STAGE_Y_ABOVE_CARDS_VH = parseFloat(JOIN_STAGE_ABOVE_CARDS.y);
const JOIN_STAGE_SCALE_SEPARATED = JOIN_STAGE_SEPARATED.scale;
const JOIN_STAGE_SCALE_JOINED = JOIN_STAGE_JOINED.scale;
const JOIN_STAGE_SCALE_ABOVE_CARDS = JOIN_STAGE_ABOVE_CARDS.scale;

let lastCarouselPinProgress = -1;

const applyJoinStagePose = (stage, joinProgress, pinProgress = 0) => {
  const joinT = gsap.utils.clamp(0, 1, joinProgress);
  let yVh = gsap.utils.interpolate(JOIN_STAGE_Y_SEPARATED_VH, JOIN_STAGE_Y_JOINED_VH, joinT);
  let scale = gsap.utils.interpolate(JOIN_STAGE_SCALE_SEPARATED, JOIN_STAGE_SCALE_JOINED, joinT);

  if (pinProgress >= MATCH_STEPS_REVEAL_START && joinT >= 1) {
    const liftT = gsap.utils.clamp(
      0,
      1,
      gsap.utils.mapRange(
        MATCH_STEPS_REVEAL_START,
        MATCH_STEPS_PUZZLE_LIFT_END,
        0,
        1,
        pinProgress,
      ),
    );
    yVh = gsap.utils.interpolate(JOIN_STAGE_Y_JOINED_VH, JOIN_STAGE_Y_ABOVE_CARDS_VH, liftT);
    scale = gsap.utils.interpolate(JOIN_STAGE_SCALE_JOINED, JOIN_STAGE_SCALE_ABOVE_CARDS, liftT);
  }

  gsap.set(stage, {
    ...JOIN_STAGE_SEPARATED,
    y: `${yVh}vh`,
    scale,
  });
};

const MATCH_STEPS_COLLAPSED_CLASS = 'match-steps--collapsed';

const hideMatchSteps = () => {
  const matchStepsEl = document.getElementById('match-steps');
  if (!matchStepsEl) return;

  gsap.set(matchStepsEl, {
    autoAlpha: 0,
    pointerEvents: 'none',
  });
  matchStepsEl.classList.add(MATCH_STEPS_COLLAPSED_CLASS);

  const carousel = matchStepsEl.querySelector('.match-steps-carousel');
  if (carousel) {
    gsap.set(carousel, { y: 24 });
  }

  setDrivenByScroll(false);
  setCarouselScrubPhase(false);
  forceUnlockMatchStepsViewport();
  resetMatchStepsCarousel();
  lastCarouselPinProgress = -1;

  window.dispatchEvent(new CustomEvent('match-steps-carousel-scrub'));
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
    autoAlpha: revealT,
    pointerEvents: revealT >= 0.85 ? 'auto' : 'none',
  });

  if (revealT > 0.01) {
    matchStepsEl.classList.remove(MATCH_STEPS_COLLAPSED_CLASS);
  }

  const carousel = matchStepsEl.querySelector('.match-steps-carousel');
  if (carousel) {
    gsap.set(carousel, { y: gsap.utils.interpolate(24, 0, revealT) });
  }
};

const applyMatchStepsCarousel = (progress) => {
  const track = getMatchStepsTrack();
  if (!track) return;

  const prefersReduced = window.matchMedia(REDUCED_MQ).matches;
  const isDesktopScroll = window.matchMedia(DESKTOP_SCROLL_MQ).matches;

  const scrubT =
    progress < MATCH_STEPS_CAROUSEL_START
      ? 0
      : progress >= MATCH_STEPS_CAROUSEL_END
        ? null
        : gsap.utils.mapRange(
            MATCH_STEPS_CAROUSEL_START,
            MATCH_STEPS_CAROUSEL_END,
            0,
            1,
            progress,
          );

  const displayT = scrubT ?? 1;

  const inCarouselRange =
    progress >= MATCH_STEPS_CAROUSEL_START && progress < MATCH_STEPS_CAROUSEL_END;

  const useScrubTransform = isDesktopScroll && progress >= MATCH_STEPS_REVEAL_START;

  if (progress < MATCH_STEPS_CAROUSEL_START) {
    setDrivenByScroll(false);
    setCarouselScrubPhase(false);
    track.classList.toggle('match-steps-track--scrub', useScrubTransform);
    if (lastCarouselPinProgress >= MATCH_STEPS_CAROUSEL_START || lastCarouselPinProgress < 0) {
      setCarouselProgress(track, 0);
    }
    lastCarouselPinProgress = progress;

    if (isDesktopScroll) {
      window.dispatchEvent(new CustomEvent('match-steps-carousel-scrub'));
    }
    return;
  }

  if (!isDesktopScroll && !prefersReduced) {
    setCarouselScrubPhase(false);
    lastCarouselPinProgress = progress;
    return;
  }

  setDrivenByScroll(isDesktopScroll && inCarouselRange);
  setCarouselScrubPhase(isDesktopScroll && inCarouselRange);
  track.classList.toggle('match-steps-track--scrub', useScrubTransform);

  if (
    inCarouselRange &&
    lastCarouselPinProgress < MATCH_STEPS_CAROUSEL_START
  ) {
    invalidateCarouselMeasure();
  }

  measureCarousel(track);
  setCarouselProgress(track, displayT);
  lastCarouselPinProgress = progress;

  if (isDesktopScroll) {
    window.dispatchEvent(new CustomEvent('match-steps-carousel-scrub'));
  }
};

const applyPuzzleMotion = (scrollMotion, progress) => {
  if (progress <= JOIN_ANIM_DURATION) {
    scrollMotion.joinProgress = gsap.utils.mapRange(0, JOIN_ANIM_DURATION, 0, 1, progress);
    scrollMotion.separatedCorners = scrollMotion.joinProgress < CORNERS_JOINED_THRESHOLD;
    scrollMotion.modelScale = gsap.utils.interpolate(
      JOIN_MODEL_SCALE_SEPARATED,
      1,
      scrollMotion.joinProgress,
    );
  } else {
    scrollMotion.joinProgress = 1;
    scrollMotion.separatedCorners = false;
    scrollMotion.modelScale = 1;
  }

  if (progress <= TILT_PHASE_START) {
    scrollMotion.rotationY = 0;
    scrollMotion.rotationZ = 0;
    return;
  }

  const tiltT = gsap.utils.mapRange(TILT_PHASE_START, 1, 0, 1, progress);
  scrollMotion.rotationY = tiltT * FINAL_MOTION_RIGHT.rotationY;
  scrollMotion.rotationZ = tiltT * FINAL_MOTION_RIGHT.rotationZ;
};

/**
 * Single orchestrator for puzzle join pin — all phases scrub symmetrically forward/back.
 */
const applyJoinPinState = ({ scrollMotion, stage, overlay, progress, pinActive }) => {
  const t = gsap.utils.clamp(0, 1, progress);

  if (overlay && pinActive) {
    overlay.style.zIndex = String(PUZZLE_Z_JOIN);
  }

  applyPuzzleMotion(scrollMotion, t);

  if (stage) {
    applyJoinStagePose(stage, scrollMotion.joinProgress, t);
    const stageOpacity = t > 0.85 ? gsap.utils.mapRange(0.85, 1, 1, 0.7, t) : 1;
    gsap.set(stage, { opacity: stageOpacity });
  }

  updateMatchStepsViewportLock(t, pinActive);
  applyMatchStepsReveal(t);
  applyMatchStepsCarousel(t);
};

const applyHeroPuzzleMotion = (scrollMotion) => {
  Object.assign(scrollMotion, HERO_PUZZLE_MOTION);
};

const hideAboveJoin = (stage, overlay, scrollMotion) => {
  gsap.set(stage, { opacity: 0 });
  applyHeroPuzzleMotion(scrollMotion);
  hideMatchSteps();
  if (overlay) {
    overlay.style.zIndex = String(PUZZLE_Z_DEFAULT);
  }
};

const hidePuzzleOverlay = (stage, overlay) => {
  gsap.set(stage, { opacity: 0 });
  forceUnlockMatchStepsViewport();
  if (overlay) {
    overlay.style.zIndex = String(PUZZLE_Z_DEFAULT);
  }
};

/** Restore join-phase puzzle when scrolling back up from Who We Work With. */
const restoreJoinPuzzleIfPastHero = (stage, overlay, scrollMotion) => {
  const joinST = ScrollTrigger.getById('puzzle-join-scroll');
  if (!joinST || joinST.progress <= 0) return;

  if (overlay) {
    overlay.style.zIndex = String(PUZZLE_Z_JOIN);
  }
  const progress = Math.min(joinST.progress, 1);
  applyJoinPinState({
    scrollMotion,
    stage,
    overlay,
    progress,
    pinActive: Boolean(joinST.isActive),
  });
};

/**
 * Pinned join phase: separated corner pieces → scrub join → reveal → carousel → tilt.
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

        const runPinState = (progress, pinActive) => {
          applyJoinPinState({
            scrollMotion,
            stage,
            overlay,
            progress: gsap.utils.clamp(0, 1, progress),
            pinActive,
          });
        };

        if (prefersReduced) {
          runPinState(1, true);
          gsap.set(stage, { opacity: 1 });
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
          anticipatePin: 0,
          fastScrollEnd: false,
          onEnter() {
            runPinState(0, true);
          },
          onEnterBack(self) {
            runPinState(self.progress, true);
          },
          onUpdate(self) {
            const progress = gsap.utils.clamp(0, 1, self.progress);

            if (!self.isActive) {
              if (progress <= 0) {
                hideAboveJoin(stage, overlay, scrollMotion);
              } else if (progress >= 1) {
                hideMatchSteps();
                hidePuzzleOverlay(stage, overlay);
              } else {
                runPinState(progress, false);
              }
              return;
            }

            runPinState(progress, true);
          },
          onLeave() {
            hideMatchSteps();
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

    const onResize = () => {
      invalidateCarouselMeasure();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const unsub = onScrollReady(setup);
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      unsub();
      window.removeEventListener('resize', onResize);
      ctx?.revert();
    };
  }, [scrollMotionRef, stageRef, overlayRef]);
};
