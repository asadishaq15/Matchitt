import {
  MATCH_STEPS_REVEAL_START,
  MATCH_STEPS_UNLOCK_START,
} from '../constants/puzzleJoin';

const LOCK_CLASS = 'match-steps--viewport-locked';

let isLocked = false;

export const updateMatchStepsViewportLock = (progress, pinActive) => {
  const el = document.getElementById('match-steps');
  if (!el) return;

  if (pinActive && progress >= MATCH_STEPS_REVEAL_START) {
    isLocked = true;
  } else if (!pinActive || progress < MATCH_STEPS_UNLOCK_START) {
    isLocked = false;
  }

  el.classList.toggle(LOCK_CLASS, isLocked);
};

/** @deprecated Use updateMatchStepsViewportLock */
export const lockMatchStepsToViewport = (locked) => {
  const el = document.getElementById('match-steps');
  if (!el) return;
  isLocked = locked;
  el.classList.toggle(LOCK_CLASS, locked);
};

export const isMatchStepsViewportLocked = () => isLocked;

export const forceUnlockMatchStepsViewport = () => {
  isLocked = false;
  const el = document.getElementById('match-steps');
  el?.classList.remove(LOCK_CLASS);
};
