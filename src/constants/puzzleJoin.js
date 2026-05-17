/** Blender hierarchy: Null → Extrude, Extrude.1 */
export const PIECE_NAMES = {
  left: 'Extrude.1',
  right: 'Extrude',
};

export const NULL_ROOT_NAME = 'Null';

/** Extra model-space offset per side when fully separated (joinProgress = 0). */
export const SEPARATION_EXTRA = 3.2;

/** Multiplier on the rest gap between piece centers. */
export const SEPARATION_GAP_FACTOR = 0.85;

/** Target Y / Z for both pieces when fully separated (aligned, coplanar). */
export const SEPARATED_ALIGN_Y = 0;
export const SEPARATED_ALIGN_Z = 0;

/**
 * Euler offsets (radians) applied at full separation — pieces yaw outward
 * and tilt slightly toward camera.
 */
export const SEPARATED_ROTATION = {
  left: { x: 0.12, y: -0.28, z: 0.08 },
  right: { x: 0.12, y: 0.28, z: -0.08 },
};

/** Gentler whole-model rotation when pieces are separated (radians). */
export const SEPARATED_GROUP_ROTATION = [-0.38, -2.82, -0.32];

export const CAMERA_Z_JOINED = 6.2;
export const CAMERA_Z_SEPARATED = 9.2;
export const CAMERA_FOV_JOINED = 43;
export const CAMERA_FOV_SEPARATED = 48;

/** Viewport heights of pinned scroll for join, carousel scrub, and tilt. */
export const JOIN_SCROLL_VH = 4.5;

/** Share of pinned timeline for pieces joining (joinProgress 0→1). */
export const JOIN_ANIM_DURATION = 0.48;

/** Pin progress when match-step cards begin fading in. */
export const MATCH_STEPS_REVEAL_START = 0.48;

/** Pin progress when viewport lock releases on reverse scroll (hysteresis). */
export const MATCH_STEPS_UNLOCK_START = 0.46;

/** Pin progress when match-step cards are fully visible. */
export const MATCH_STEPS_REVEAL_END = 0.58;

/** Pin progress when the puzzle finishes lifting above the cards (before carousel scrub). */
export const MATCH_STEPS_PUZZLE_LIFT_END = 0.55;

/** Pin progress when scroll-driven horizontal carousel scrub begins. */
export const MATCH_STEPS_CAROUSEL_START = 0.58;

/** Pin progress when scroll-driven horizontal carousel scrub ends. */
export const MATCH_STEPS_CAROUSEL_END = 0.88;

/** Pin progress when final model tilt begins (after carousel). */
export const TILT_PHASE_START = 0.88;

/** Share of pinned timeline for final tilt after carousel. */
export const TILT_ANIM_DURATION = 0.08;

/** Final scrollMotion rotation after join (whole model, pieces unchanged). */
export const FINAL_MOTION_RIGHT = {
  rotationY: 0.12,
  rotationZ: -0.05,
};

/** modelScale at full separation during join pin (lerps to 1 when joined). */
export const JOIN_MODEL_SCALE_SEPARATED = 1.12;

/** GSAP scrub: 1 = 1:1 with scroll (best reverse fidelity). */
export const JOIN_SCRUB = 1;

/** GSAP scrub smoothness for What We Do → join handoff. */
export const HANDOFF_SCRUB = 0.85;

export const PUZZLE_Z_DEFAULT = 18;
export const PUZZLE_Z_JOIN = 45;

/** GSAP stage scale for the puzzle overlay during hero scroll. */
export const HERO_STAGE_SCALE = 0.65;

/** Stage pose when the puzzle first appears on the hero. */
export const HERO_STAGE_INITIAL = {
  x: '5vw',
  y: '10vh',
  scale: HERO_STAGE_SCALE,
  rotate: 0,
};

/** Stage pose at end of hero scroll (matches ScrollingPuzzle hero timeline). */
export const HERO_STAGE_END = {
  xPercent: -50,
  yPercent: -50,
  x: '40vw',
  y: '40vh',
  scale: HERO_STAGE_SCALE,
  rotate: 14,
  opacity: 0.7,
};

const JOIN_STAGE_BASE = {
  left: '50%',
  top: '50%',
  width: '100vw',
  height: '100vh',
  xPercent: -50,
  yPercent: -50,
  x: 0,
  rotate: 0,
};

/** Stage pose when pieces are separated at join start. */
export const JOIN_STAGE_SEPARATED = {
  ...JOIN_STAGE_BASE,
  y: '-6vh',
  scale: 0.78,
};

/** Stage pose when pieces are joined — centered and lower on viewport. */
export const JOIN_STAGE_JOINED = {
  ...JOIN_STAGE_BASE,
  y: '8vh',
  scale: 0.84,
};

/** Stage pose while match-step cards are visible below the puzzle. */
export const JOIN_STAGE_ABOVE_CARDS = {
  ...JOIN_STAGE_BASE,
  y: '-18vh',
  scale: 0.8,
};

/** @deprecated Use JOIN_STAGE_JOINED; kept for imports that expect a single pose. */
export const JOIN_STAGE_VIEW = {
  ...JOIN_STAGE_JOINED,
  opacity: 1,
};

/** scrollMotion rotation at end of hero scroll. */
export const HERO_MOTION_END = {
  rotationX: 0.06,
  rotationY: -0.42,
  rotationZ: -0.06,
};

/** Joined puzzle state while scrubbing the hero (not the join pin). */
export const HERO_PUZZLE_MOTION = {
  joinProgress: 1,
  separatedCorners: false,
  modelScale: 1,
  rotationX: 0,
  rotationY: -0.38,
  rotationZ: 0,
};

/** Extra model-space offsets per piece when separated in join corners layout. */
export const CORNER_PIECE_OFFSET = {
  left: { x: -1.0, y: -0.15, z: 0 },
  right: { x: 1.0, y: -0.15, z: 0 },
};
