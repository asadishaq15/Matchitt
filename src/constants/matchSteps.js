/** Four-step "How we match" row assets under /public/Match/ */
export const MATCH_STEPS = [
  {
    id: 1,
    puzzle: '/Match/p1-blue.png',
    bg: '/Match/p1-bg.png',
    label: '/Match/p1-heading.png',
    alt: 'Understand',
    puzzleRotate: -8,
  },
  {
    id: 2,
    puzzle: '/Match/p2-red.png',
    bg: '/Match/p2-bg.png',
    label: '/Match/p2-title.png',
    alt: 'Strategize',
    puzzleRotate: 6,
  },
  {
    id: 3,
    puzzle: '/Match/p3-blue.png',
    bg: '/Match/p3-bg.png',
    label: '/Match/p3-title.png',
    alt: 'Create and build',
    puzzleRotate: 2,
  },
  {
    id: 4,
    puzzle: '/Match/p4-red.png',
    bg: '/Match/p4-bg.png',
    label: '/Match/p4-title.png',
    alt: 'Launch and match',
    puzzleRotate: -12,
  },
];

/** Eight slides for scroll-driven carousel scrub (second set mirrors first). */
export const MATCH_STEPS_SCRUB = [
  ...MATCH_STEPS,
  ...MATCH_STEPS.map((step) => ({ ...step, id: step.id + 4 })),
];
