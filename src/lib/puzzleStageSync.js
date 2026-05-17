import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isHeroControllingStage, isJoinControllingStage } from './puzzleStagePhase';

/** @type {(() => void) | null} */
let heroSync = null;

/** @type {((st: ScrollTrigger) => void) | null} */
let joinSync = null;

/** @type {(() => void) | null} */
let hideAboveJoinFn = null;

export const registerPuzzleStageHeroSync = (fn) => {
  heroSync = fn;
};

export const registerPuzzleStageJoinSync = (fn) => {
  joinSync = fn;
};

export const registerPuzzleStageHideAboveJoin = (fn) => {
  hideAboveJoinFn = fn;
};

/**
 * Single entry point for hero + join ScrollTrigger callbacks.
 * Routes updates to whichever phase owns the fixed puzzle stage.
 */
export const syncPuzzleStageFromScroll = () => {
  const joinST = ScrollTrigger.getById('puzzle-join-scroll');

  if (isJoinControllingStage()) {
    if (joinSync && joinST) {
      joinSync(joinST);
    }
    return;
  }

  if (isHeroControllingStage()) {
    if (heroSync) {
      heroSync();
    }
    return;
  }

  hideAboveJoinFn?.();
};
