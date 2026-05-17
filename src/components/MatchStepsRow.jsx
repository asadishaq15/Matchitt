import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MATCH_STEPS } from '../constants/matchSteps';

const COLUMN_MAX = 'clamp(140px, 22vw, 280px)';
const PUZZLE_WIDTH = 'clamp(100px, 16vw, 200px)';
const LABEL_MIN_HEIGHT = 'clamp(72px, 10vw, 120px)';

const MatchStepCard = ({ puzzle, bg, label, alt, puzzleRotate = 0 }) => (
  <article
    className="match-step"
    style={{
      position: 'relative',
      width: '100%',
      maxWidth: COLUMN_MAX,
      margin: '0 auto',
      paddingTop: 'clamp(48px, 8vw, 88px)',
    }}
  >
    <img
      src={puzzle}
      alt=""
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: `translateX(-50%) rotate(${puzzleRotate}deg)`,
        width: PUZZLE_WIDTH,
        height: 'auto',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: LABEL_MIN_HEIGHT,
        marginTop: 'clamp(32px, 5vw, 56px)',
      }}
    >
      <img
        src={bg}
        alt=""
        aria-hidden="true"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
      />
      <img
        src={label}
        alt={alt}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(88%, 92%, 96%)',
          height: 'auto',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  </article>
);

const MatchStepsRow = () => {
  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    refresh();
    window.addEventListener('resize', refresh);
    return () => window.removeEventListener('resize', refresh);
  }, []);

  return (
    <section
      id="match-steps"
      aria-label="How we match steps"
      className="relative bg-cream"
      style={{
        marginTop: 'clamp(24px, 4vh, 48px)',
        padding:
          'clamp(48vh, 52vh, 56vh) clamp(16px, 4vw, 40px) clamp(72px, 10vh, 120px)',
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        className="match-steps-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 'clamp(12px, 2.5vw, 32px)',
          width: '100%',
          maxWidth: 'min(1280px, 96vw)',
          margin: '0 auto',
          transform: 'translateY(24px)',
        }}
      >
        {MATCH_STEPS.map((step) => (
          <MatchStepCard key={step.id} {...step} />
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .match-steps-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .match-steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default MatchStepsRow;
