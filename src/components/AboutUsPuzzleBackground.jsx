import PuzzleScene from '../scenes/PuzzleScene';

/** Align with copy column, nudged further right */
const PUZZLE_RIGHT = 'clamp(8px, 2.5vw, 40px)';
const PUZZLE_SHIFT_X = '12%';
const PUZZLE_SIZE = 'min(520px, 54vw)';

const AboutUsPuzzleBackground = ({ motionRef }) => {
  return (
    <div
      className="about-us__puzzle-bg hidden md:block"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-us__puzzle-stage"
        style={{
          position: 'absolute',
          right: PUZZLE_RIGHT,
          top: '50%',
          width: PUZZLE_SIZE,
          height: PUZZLE_SIZE,
          transform: `translate(${PUZZLE_SHIFT_X}, -50%)`,
          opacity: 0.26,
        }}
      >
        <PuzzleScene
          className="h-full w-full min-h-0"
          controlsEnabled={false}
          scrollMotionRef={motionRef}
          showParticles={false}
          dimmed
        />
      </div>
      <div
        className="about-us__puzzle-scrim"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'linear-gradient(to right, rgba(125, 51, 69, 0.88) 0%, rgba(125, 51, 69, 0.82) 38%, rgba(125, 51, 69, 0.58) 62%, rgba(125, 51, 69, 0.48) 100%)',
        }}
      />
    </div>
  );
};

export default AboutUsPuzzleBackground;
