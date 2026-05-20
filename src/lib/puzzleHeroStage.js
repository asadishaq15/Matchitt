import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HERO_PUZZLE_MOTION,
  HERO_STAGE_GSAP,
  PUZZLE_Z_DEFAULT,
} from '../constants/puzzleJoin';

export const getHeroScrollTrigger = () => {
  const heroEl = document.getElementById('hero');
  if (!heroEl) return null;

  return (
    ScrollTrigger.getAll().find((st) => st.trigger === heroEl) ?? null
  );
};

/** True while the hero section owns the shared puzzle stage. */
export const isHeroControllingPuzzle = () => {
  const heroST = getHeroScrollTrigger();
  if (!heroST) return false;

  if (heroST.isActive || (heroST.progress > 0 && heroST.progress < 1)) {
    return true;
  }

  if (heroST.progress <= 0) {
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }
  }

  return false;
};

export const applyHeroStage = (stage, scrollMotion, { visible = true } = {}) => {
  if (stage) {
    gsap.set(stage, {
      ...HERO_STAGE_GSAP,
      opacity: visible ? 1 : 0,
    });
  }

  if (scrollMotion) {
    Object.assign(scrollMotion, HERO_PUZZLE_MOTION);
  }
};

export const hidePuzzleAboveJoin = (stage, overlay, scrollMotion) => {
  applyHeroStage(stage, scrollMotion, { visible: false });
  if (overlay) {
    overlay.style.zIndex = String(PUZZLE_Z_DEFAULT);
  }
};
