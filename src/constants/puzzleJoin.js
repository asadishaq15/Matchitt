/** Blender hierarchy: Null → Extrude, Extrude.1 */
export const PIECE_NAMES = {
  left: 'Extrude.1',
  right: 'Extrude',
};

export const NULL_ROOT_NAME = 'Null';

/** Extra model-space offset per side when fully separated (joinProgress = 0). */
export const SEPARATION_EXTRA = 2.85;

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
/** Minimal pullback while separated — keeps puzzle close to camera. */
export const CAMERA_Z_SEPARATED = 6.75;
export const CAMERA_FOV_JOINED = 43;
export const CAMERA_FOV_SEPARATED = 44;

/** Extra camera pull-back factor when pieces separate (keep low to avoid drifting away). */
export const CAMERA_SEPARATED_PADDING = 0.04;

/** Full Y-axis spin (radians) during separate + re-join scrub. */
export const JOIN_SPIN_RADIANS = Math.PI * 2;

/** Share of join spin (0–1) used to blend from hero rotation into monotonic spin. */
export const JOIN_SPIN_BLEND_END = 0.06;

/** Viewport heights of pinned scroll for join, carousel scrub, and tilt. */
export const JOIN_SCROLL_VH = 5.0;

/** Pin progress while puzzle stays joined before separation begins. */
export const JOIN_HOLD_END = 0.05;

/** Pin progress when separation finishes (joinProgress → 0). */
export const SEPARATE_PHASE_END = 0.27;

/** Pin progress when re-join finishes (joinProgress → 1). */
export const JOIN_PHASE_END = 0.51;

/** @deprecated Use JOIN_PHASE_END — kept for existing imports. */
export const JOIN_ANIM_DURATION = JOIN_PHASE_END;

/** Pin progress when match-step cards begin fading in. */
export const MATCH_STEPS_REVEAL_START = 0.51;

/** Pin progress when viewport lock releases on reverse scroll (hysteresis). */
export const MATCH_STEPS_UNLOCK_START = 0.49;

/** Pin progress when match-step cards are fully visible. */
export const MATCH_STEPS_REVEAL_END = 0.61;

/** Pin progress when the puzzle finishes lifting above the cards (before carousel scrub). */
export const MATCH_STEPS_PUZZLE_LIFT_END = 0.58;

/** Pin progress when scroll-driven horizontal carousel scrub begins. */
export const MATCH_STEPS_CAROUSEL_START = 0.61;

/** Pin progress when scroll-driven horizontal carousel scrub ends. */
export const MATCH_STEPS_CAROUSEL_END = 0.91;

/** Pin progress when final model tilt begins (after carousel). */
export const TILT_PHASE_START = 0.91;

/** Share of pinned timeline for final tilt after carousel. */
export const TILT_ANIM_DURATION = 0.08;

/** Final scrollMotion rotation after join (whole model, pieces unchanged). */
export const FINAL_MOTION_RIGHT = {
  rotationY: 0.12,
  rotationZ: -0.05,
};

/** scrollMotion rotation at join pin entry (matches hero handoff). */
export const JOIN_ROTATION_HOLD = {
  rotationX: 0,
  rotationY: -0.38,
  rotationZ: 0,
};

/** scrollMotion rotation at peak separation during join pin. */
export const JOIN_ROTATION_SEPARATED = {
  rotationX: 0.1,
  rotationY: -0.58,
  rotationZ: 0.05,
};

/** scrollMotion rotation when re-joined, before match-steps / carousel. */
export const JOIN_ROTATION_JOINED = {
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
};

/** modelScale at full separation — kept near 1 so camera does not pull back. */
export const JOIN_MODEL_SCALE_SEPARATED = 1;

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

/** Full GSAP stage reset for hero ownership (position + transform base). */
export const HERO_STAGE_GSAP = {
  xPercent: -50,
  yPercent: -50,
  left: '50%',
  top: '50%',
  width: '100vw',
  height: '100vh',
  ...HERO_STAGE_INITIAL,
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

/** Join pin WebGL stage — larger than viewport so the puzzle reads bigger on screen. */
export const JOIN_STAGE_WIDTH = '110vw';
export const JOIN_STAGE_HEIGHT = '110vh';

const JOIN_STAGE_BASE = {
  left: '50%',
  top: '50%',
  width: JOIN_STAGE_WIDTH,
  height: JOIN_STAGE_HEIGHT,
  xPercent: -50,
  yPercent: -50,
  x: 0,
  rotate: 0,
};

/** Horizontal offset for join pin stage (right of viewport center). */
export const JOIN_STAGE_X = '20vw';

/** Vertical offset during separate / re-join (lower on screen). */
export const JOIN_STAGE_Y_JOIN = '16vh';

/** Vertical offset when match-step cards are visible (slightly above join pose). */
export const JOIN_STAGE_Y_MATCH_STEPS = '6vh';

/** Join pin stage pose — lower-right (clears hero drift). */
export const JOIN_STAGE_CENTERED = {
  ...JOIN_STAGE_BASE,
  x: JOIN_STAGE_X,
  y: JOIN_STAGE_Y_JOIN,
  rotate: 0,
  scale: 0.82,
};

/** Stage pose when pieces are separated at join start. */
export const JOIN_STAGE_SEPARATED = {
  ...JOIN_STAGE_BASE,
  x: JOIN_STAGE_X,
  y: JOIN_STAGE_Y_JOIN,
  scale: 0.86,
};

/** Stage pose when pieces are joined. */
export const JOIN_STAGE_JOINED = {
  ...JOIN_STAGE_BASE,
  x: JOIN_STAGE_X,
  y: JOIN_STAGE_Y_JOIN,
  scale: 0.94,
};

/** Stage pose while match-step cards are visible below the puzzle. */
export const JOIN_STAGE_ABOVE_CARDS = {
  ...JOIN_STAGE_BASE,
  x: JOIN_STAGE_X,
  y: JOIN_STAGE_Y_MATCH_STEPS,
  scale: 0.9,
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
  left: { x: -0.55, y: -0.08, z: 0 },
  right: { x: 0.65, y: -0.08, z: 0 },
};
