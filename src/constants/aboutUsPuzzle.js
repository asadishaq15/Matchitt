import gsap from 'gsap';

export const ABOUT_PUZZLE_MOTION_INITIAL = {
  joinProgress: 1,
  separatedCorners: false,
  modelScale: 0.85,
  rotationX: 0.08,
  rotationY: 0,
  rotationZ: 0,
};

const ROTATION_Y_END = Math.PI * 0.55;
const ROTATION_X_START = 0.08;
const ROTATION_X_END = 0.18;
const ROTATION_Z_END = 0.06;
const SCALE_START = 0.85;
const SCALE_END = 0.92;

/** Drive joined puzzle rotation from About Us pin progress (0–1). */
export const applyAboutPuzzleMotion = (motionRef, progress) => {
  if (!motionRef?.current) return;

  const t = gsap.utils.clamp(0, 1, progress);

  motionRef.current.joinProgress = 1;
  motionRef.current.separatedCorners = false;
  motionRef.current.modelScale = gsap.utils.interpolate(SCALE_START, SCALE_END, t);
  motionRef.current.rotationX = gsap.utils.interpolate(ROTATION_X_START, ROTATION_X_END, t);
  motionRef.current.rotationY = t * ROTATION_Y_END;
  motionRef.current.rotationZ = t * ROTATION_Z_END;
};

export const resetAboutPuzzleMotion = (motionRef) => {
  if (!motionRef?.current) return;
  Object.assign(motionRef.current, ABOUT_PUZZLE_MOTION_INITIAL);
};
